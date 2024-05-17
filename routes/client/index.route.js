const productsRouter = require("./products.route");
const homeRouter = require("./home.route");
const searchRoutes = require("./search.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    
    app.get("/", homeRouter);

    app.use("/products", productsRouter)

    app.use("/search", searchRoutes);
}

