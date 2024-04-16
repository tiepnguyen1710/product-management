const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper")

module.exports.index = async (req, res) => {
    // const filterState = [
    //     {
    //       name: "Tất cả",
    //       status: "",
    //       class: ""
    //     },
    //     {
    //       name: "Hoạt động",
    //       status: "active",
    //       class: ""
    //     },
    //     {
    //       name: "Dừng hoạt động",
    //       status: "inactive",
    //       class: ""
    //     }
    // ];

    // const index = filterState.findIndex(item => item.status == req.query.status);
    // if(req.query.status){
    //     filterState[index].class = "active";
    // }
    // else{
    //     filterState[0].class = "active";
    // }
    
    const find = {
        deleted: false
    }

    //Filter
    const filterState = filterStatusHelper(req.query);

    if(req.query.status){
        find.status = req.query.status;
    }
    // End Filter

    // Search
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    //End Search

    //pagination
    
    // const objectPagination = {
    //     currentPage : 1,
    //     limitItems : 4
    // }

    // if(req.query.page){
    //     objectPagination.currentPage = parseInt(req.query.page);
    // }

    // console.log(req.query.page);

    // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    // const totalProduct = await Product.countDocuments(find);
    // objectPagination.totalPage = Math.ceil(totalProduct / objectPagination.limitItems);
    const totalProduct = await Product.countDocuments(find);
    objectPagination = paginationHelper(req.query, totalProduct)

    //end pagination
    
    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    //console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products : products,
        filterState: filterState,
        keyword: req.query.keyword,
        pagination : objectPagination
    });
}

module.exports.changeStatus = async (req, res) => {
    //console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id : id}, {status : status})
    
    res.redirect("back");
}