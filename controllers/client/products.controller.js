const Product = require("../../models/product.model");



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