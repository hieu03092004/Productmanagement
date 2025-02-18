// Button Status

const buttonsStatus = document.querySelectorAll("[button-status]");
// console.log(buttonsStatus);
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);
  // console.log(url);
  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      console.log(status);
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
//end button status
//form-search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
//end form-search

//pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  let url = new URL(window.location.href);
  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      // console.log(page);
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}

//end pagination
//checkboxALL
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  // console.log(checkboxMulti);
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
//end checkboxALL

//form change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );
    const typeChange = e.target.elements.type.value;

    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này");
      if (!isConfirm) return;
    }
    if (inputChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach((input) => {
        const id = input.value;
        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          console.log(position);
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });
      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi");
    }
  });
}

//end form change Multi
//show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
//end show alert

//upload Image
const upLoadImage = document.querySelector("[upload-image]");
if(upLoadImage){
  const upLoadImageInput =document.querySelector("[upload-image-input]");
  const upLoadImagePreview =document.querySelector("[upload-image-preview]");
  upLoadImageInput.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    if(file){
      upLoadImagePreview.src = URL.createObjectURL(file);
    }
  })
}
//End upload image
//sort
const sort=document.querySelector("[sort]");
if(sort){
  let url=new URL(window.location.href);
  const sortSelect=sort.querySelector("[sort-select]");
  const sortClear=sort.querySelector("[sort-clear]");
  sortSelect.addEventListener("change",(e)=>{
    const value=e.target.value;
    const [sortKey,sortValue]=value.split("-");
    console.log(sortKey,sortValue);
    url.searchParams.set("sortKey",sortKey);
    url.searchParams.set("sortValue",sortValue);
    window.location.href=url.href;
  });
  sortClear.addEventListener("click",()=>{
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href=url.href;
  }); 
}
//end sort
