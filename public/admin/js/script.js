
//filter

const buttonsStatus = document.querySelectorAll("[button-status]");

if(buttonsStatus.length > 0){
    let url = new URL(window.location.href);

    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            //console.log(status);
            if(status){
                url.searchParams.set("status", status);
            }
            else{
                url.searchParams.delete("status");
            }
            console.log(url);

            window.location.href = url.href;
        });

    })
//end-filter


//Search

const formSearch = document.querySelector("#form-search");

if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = event.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }
        else{
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}

//end-search

//Pagination

const buttonPagination = document.querySelectorAll("[button-pagination]")

if(buttonPagination.length > 0){
    let url = new URL(window.location.href)

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            page = button.getAttribute("button-pagination");
            console.log(page)
            if(page){
                url.searchParams.set("page", page);
            }

            window.location.href = url.href;
        });
    });
}

//End-Pagination
}

//Change-multi

const checkBoxMulti = document.querySelector("[checkbox-multi]")

if(checkBoxMulti){
    const checkAllBut = checkBoxMulti.querySelector("input[name='checkall']")
    const listCheck = checkBoxMulti.querySelectorAll("input[name='id']");
    
    checkAllBut.addEventListener("click", () => {
        if(checkAllBut.checked){
            listCheck.forEach(checkBox => {
                checkBox.checked = true;
            })
        }
        else{
            listCheck.forEach(checkBox => {
                checkBox.checked = false;
            })
        }
    });

    listCheck.forEach(checkBox => {
        checkBox.addEventListener("click", () => {
           listCheckedLength = checkBoxMulti.querySelectorAll("input[name=id]:checked").length;
           checkLength = listCheck.length;
           
           if(listCheckedLength == checkLength){
                checkAllBut.checked = true;
           }
           else{
                checkAllBut.checked = false;
           }
        });
    });
}

//End-change-multi

//Form-changeMulti

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = formChangeMulti.querySelector("select[name=type]").value;
        
        //
        Ids = [];
        listChecked = checkBoxMulti.querySelectorAll("input[name=id]:checked");
        if(listChecked.length > 0){
            listChecked.forEach(check => {
                const id = check.getAttribute("value");
                if(type == "change-position") {
                    const position = check.closest("tr").querySelector("input[name='position']").value;
                    Ids.push(`${id}-${position}`);
                  } else {
                    Ids.push(id);
                  }
                
            })
            IdsString = Ids.join(",");
            
            const formControl = formChangeMulti.querySelector("input[name=ids]");
            if(formControl){
                formControl.value = IdsString;
            }

            if (type == "delete-all"){
                const Isconfirm = confirm("Bạn có chắc chắn xóa những sản phẩm này");
                if(!Isconfirm){
                    return;
                }
            }
    
            formChangeMulti.submit();
        }
        else{
            alert("Vui long chon mot ban ghi");
        }
    });
}

//End-Form-changeMulti

//Delete

const butDel = document.querySelectorAll("[button-delete]");
if(butDel.length > 0){
    const formDel = document.querySelector("#form-delete");
    butDel.forEach(but => {
        but.addEventListener("click", () => {
            const Isconfirm = confirm("Bạn có chắc chắn xóa sản phẩm này");
            if(Isconfirm){
                const idDel = but.getAttribute("id-del"); 
                
                const path = formDel.getAttribute("path");
                const action = `${path}/${idDel}?_method=DELETE`;
                console.log(action);
    
                formDel.action = action;
                formDel.submit();
            }
        });
    })
}

//End-delete

// show-alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show-alert

// upload-image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End upload-image

// Table permissions
const buttonSubmitPermissions = document.querySelector("[button-submit-permissions]");

if(buttonSubmitPermissions) {
  buttonSubmitPermissions.addEventListener("click", () => {
    const roles = [];
    const tablePermissions = document.querySelector("[table-permissions]");
    const rows = tablePermissions.querySelectorAll("tbody tr[data-name]");

    rows.forEach((row, index) => {
      const dataName = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if(dataName == "id") {
        inputs.forEach(input => {
          const id = input.value;
          roles.push({
            id: id,
            permissions: []
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const inputChecked = input.checked;
          if(inputChecked) {
            roles[index].permissions.push(dataName);
          }
        });
      }
    });

    console.log(roles);
    if(roles.length > 0) {
      const formChangePermissions = document.querySelector("[form-change-permissions]");
      const inputRoles = formChangePermissions.querySelector("input[name='roles']");
      inputRoles.value = JSON.stringify(roles);
      formChangePermissions.submit();
    }
  });
}
// End Table Permissions

// Data default Table Permissions
const dataRecords = document.querySelector("[data-records]");
if(dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("[table-permissions]");
  //console.log(tablePermissions);

  records.forEach((record, index) => {
    const permissions = record.permissions;
    //console.log(permissions);
    //console.log(index);
    permissions.forEach(permission => {
        const row = tablePermissions.querySelector(`tr[data-name="${permission}"]`);
        const input = row.querySelectorAll(`input`)[index];
        input.checked = true;
      });
  });
}
// End Data default Table Permissions