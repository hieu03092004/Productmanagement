const Product = require("../../models/models.products");
const PaginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const createTreeHelper = require("../../helpers/createTree");
//[GET]/admin/products

module.exports.index = async (req, res) => {
  // console.log(req.query.status);

  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];
  if (req.query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == req.query.status
    );
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }

  let find = {
    delected: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
    // console.log(find.status);
  }

  let keyword = "";
  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }
  //Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = PaginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
    },
    req.query,
    countProducts
  );

  //end Pagination
  //sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  //end sort
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  for (const product of products) {
    const user = await Account.findOne({ _id: product.createdBy.account_id });
    if (user) {
      product.accountFullName = user.fullName;
    }
    // lay ra thong tin nguoi cuoi cung cap nhat
    const updatedBy = product.updatedBy[product.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({ _id: updatedBy.account_id });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination,
    sort: sort,
  });
};
//[PATCH]/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const updatedBy = {
    account_id: res.locals.user._id,
    updatedAt: new Date(),
  };
  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  const product = await Product.findOne({ _id: id });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};
//[PATCH]/admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(", ");
  const type = req.body.type;
  const updatedBy = {
    account_id: res.locals.user._id,
    updatedAt: new Date(),
  };
  console.log(updatedBy);
  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: ids },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: ids },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: ids },
        {
          delected: true,
          // deletedAt: new Date(),
          deletedBy: {
            account_id: res.locals.user._id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id);
        // console.log(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
      }
      req.flash(
        "success",
        `Đã thay đổi vị trí thành công ${ids.length} sản phẩm!`
      );
      break;
    default:
      break;
  }
  res.redirect("back");
};
//[DELETE]/admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne(
    { _id: id },
    {
      delected: true,
      deletedBy: {
        account_id: res.locals.user._id,
        deletedAt: new Date(),
      },
    }
  );
  //xoa mem
  req.flash("success", "Xóa sản phẩm thành công!");
  res.redirect("back");
};
//[GET]admin/products/create
module.exports.create = async (req, res) => {
  // console.log(req.query.status);
  let find = {
    delected: false,
  };

  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.Tree(category);
  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};
//[POST]admin/products/create
module.exports.createPost = async (req, res) => {
  // console.log(req.query.status);
  //validate du lieu
  // console.log(req.file);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
    // req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  req.body.createdBy = {
    account_id: res.locals.user._id,
  };
  const product = new Product(req.body);
  await product.save();
  req.flash("success", "Thêm mới sản phẩm thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
//[GET]admin/products/edit
module.exports.edit = async (req, res) => {
  // console.log(req.query.status);
  // console.log(req.params.id);
  try {
    const find = {
      delected: false,
      _id: req.params.id,
    };
    const category = await ProductCategory.find({
      delected: false,
    });
    const newCategory = createTreeHelper.Tree(category);
    const product = await Product.findOne(find);
    //ham findOne ham tim 1 object thoa man theo mot model nao do
    // console.log(product);
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  try {
    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }
  res.redirect("back");
};
//detail product
module.exports.detail = async (req, res) => {
  // console.log(req.query.status);
  // console.log(req.params.id);
  try {
    const find = {
      delected: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    //ham findOne ham tim 1 object thoa man theo mot model nao do
    // console.log(product);
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
