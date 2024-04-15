
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