const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filter-state.helper");
const paginationHelper = require("../../helpers/pagination.helper")
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");

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

// [PATCH] /admin/products/:status/:id
module.exports.changeStatus = async (req, res) => {
    //console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id : id}, {status : status})

    req.flash('success', 'Cập nhật trạng thái thành công!');
    
    res.redirect("back");
}

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    let ids = req.body.ids;

    ids = ids.split(",");
    switch(type){
        case "active":
        case "inactive":
            await Product.updateMany({
                _id : {$in : ids}
            }, {
                status: type
            });
            req.flash('success', 'Cập nhật trạng thái thành công!');
            break;
        case "delete-all":
            await Product.updateMany({
                _id : {$in : ids}
            }, {
                deleted : true
            });
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({
                _id: id
                }, {
                position: position
                });
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
    await Product.updateOne({ _id : id }, { deleted : true })

    res.redirect("back");

}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const category = await ProductCategory.find({
        deleted: false
      });
    
    const newCategory = createTreeHelper(category);

    res.render("admin/pages/products/create", {
        pageTitle : "Tao moi san pham",
        category: newCategory
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    }
    else{
        const productCount = await Product.countDocuments();
        req.body.position = productCount + 1;
    }
    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    
    const record = new Product(req.body);
    await record.save();

    req.flash('success', 'Thêm sản phẩm thành công');
    res.redirect(`/admin/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const find = {
        _id : id,
        deleted : false
    }

    const product = await Product.findOne(find);
    const category = await ProductCategory.find({
        deleted: false
      });
    
    const newCategory = createTreeHelper(category);
    res.render("admin/pages/products/edit", {
        product : product,
        category: newCategory
    });
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
  
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
  
    if(req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
  
    await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body);
  
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect(`back`);
}

module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const product = await Product.findOne({
        _id: id,
        deleted: false
    });

    res.render("admin/pages/products/detail", {
        pageTitle: `Sản phẩm: ${product.title}`,
        product: product
    });
}