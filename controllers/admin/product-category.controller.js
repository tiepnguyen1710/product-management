const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });

  //console.log(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records : records
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });
  const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/create", {
      pageTitle: "Thêm mới danh mục sản phẩm",
      records : newRecords
    });
  };

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == "") {
      const countRecords = await ProductCategory.countDocuments();
      req.body.position = countRecords + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    if(req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

    //console.log(req.body);
  
    const record = new ProductCategory(req.body);
    await record.save();
  
    req.flash("success", "Thêm mới danh mục sản phẩm thành công!");
  
    res.redirect(`/admin/products-category`);
  };

  // [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };

    const data = await ProductCategory.findOne(find);

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`/admin/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);
  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  
  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhật danh mục thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật danh mục không thành công!`);
  }

  res.redirect("back");
}