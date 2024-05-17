const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({
      deleted: false,
      status: "active",
      featured: "1"
    }).limit(4).select("-description");
  
    for (const product of productsFeatured) {
      product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
    }
  
    //console.log(productsFeatured);
    const productsNew = await Product.find({
        deleted: false,
        status: "active",
      }).sort({ position: "desc" }).limit(4).select("-description");
    
      for (const product of productsNew) {
        product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
      }
  
    res.render("client/pages/home/index", {
      pageTitle: "Trang chủ",
      productsFeatured: productsFeatured,
      productsNew: productsNew
    });
  }