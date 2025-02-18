const ProductCategory=require("../../models/product-category.model");
const systemConfig=require("../../config/system");
const createTreeHelper=require("../../helpers/createTree");
//nhung model vao
module.exports.index = async (req, res) => {
    let find={
        delected: false,
    }
    const records= await ProductCategory.find(find);
    const newRecords=createTreeHelper.Tree(records);
    res.render("admin/pages/products-category/index",{
        pageTitle:"Danh mục sản phẩm",
        records:newRecords
    })  
};
module.exports.create = async (req, res) => {
    let find={
        delected: false,
    };
    
    const records= await ProductCategory.find(find);
    const newRecords=createTreeHelper.Tree(records);
    res.render("admin/pages/products-category/create",{
        pageTitle:"Tạo danh mục sản phẩm",
        records:newRecords
    })  
};
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
        // req.body.position = countProducts + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }
      if(req.file){
        req.body.thumbnail = `/uploads/products-category/${req.file.filename}`;
      }
      const record = new ProductCategory(req.body);
      await record .save();
      req.flash("success","Thêm mới danh mục sản phẩm thành công!");
      res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
module.exports.edit = async (req, res) => {
    try{
        const id=req.params.id;
        const data= await ProductCategory.findOne({
            _id:id,
            delected:false
        });
        let find={
            delected: false,
        };
        
        const records= await ProductCategory.find(find);
        const newRecords=createTreeHelper.Tree(records);
        res.render("admin/pages/products-category/edit",{
            pageTitle:"Chỉnh sửa danh mục sản phẩm",
            data:data,
            records:newRecords
        })  
    }
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};
//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id=req.params.id;
    req.body.position=parseInt(req.body.position);
    if(req.file){
        req.body.thumbnail = `/uploads/products-category/${req.file.filename}`;
    }
    try{
        await ProductCategory.updateOne({
            _id:id
        },req.body);
    }
    catch(err){
        req.flash("error","Cập nhật danh mục sản phẩm thất bại");
    }
    req.flash("success","Cập nhật danh mục sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    
};