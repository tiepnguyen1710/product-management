//Change-status

const butChangeStatus = document.querySelectorAll("[button-change-status]");
const formChangeStatus = document.querySelector("#form-change-status");
console.log(formChangeStatus);
if(butChangeStatus.length > 0){
    butChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            //console.log(currentStatus);
            //console.log(id);
            const statusChange = currentStatus == "active" ? "inactive" : "active";
            //console.log(statusChange);
            const path = formChangeStatus.getAttribute("path");
            console.log(path);
            formChangeStatus.action = `${path}/${statusChange}/${id}`;
            
            formChangeStatus.submit();
        })
    })
}

//End Change-status