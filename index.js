const express = require("express");
const mongoose = require("mongoose");
const database = require ("./config/database");
const systemConfig = require("./config/system");
require("dotenv").config();

database.connect();

const app = express();
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const port = process.env.PORT;


app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})