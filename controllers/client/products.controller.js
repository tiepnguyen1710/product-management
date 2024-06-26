const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");


module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
    .sort({ position: "desc" });

    //console.log(products);
    for (const item of products) {
        item.priceNew = item.price * (1 - item.discountPercentage/100);
        item.priceNew = item.priceNew.toFixed(0);
      }

    res.render("client/pages/products/index",{
        pageTilte: "Danh sach san pham",
        products: products
    });
}

module.exports.add = (req, res) => {
    res.send("Them san pham");
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
  
    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active"
    });

    const category = await ProductCategory.findOne({
      _id: product.product_category_id,
      deleted: false,
      status: "active"
    });
  
    product.category = category;
  
    product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
  
    if(product) {
      res.render("client/pages/products/detail", {
        pageTitle: "Chi tiết sản phẩm",
        product: product
      });
    } else {
      res.redirect("/");
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active"
  });

  const getSubCategory = async (parent_id) => {
    let allSubs = [];

    const listSub = await ProductCategory.find({
      parent_id: parent_id,
      deleted: false,
      status: "active"
    }).select("id title");

    allSubs = [...listSub];

    for (const sub of listSub) {
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  };

  const listSubCategory = await getSubCategory(category.id);
  const listIdSubCategory = listSubCategory.map(item => item.id);

  const products = await Product.find({
    //product_category_id: category.id,
    product_category_id: { $in: [category.id, ...listIdSubCategory] },
    deleted: false,
    status: "active"
  }).sort({ position: "desc" });

  for (const item of products) {
    item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
  }

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: products
  });
}