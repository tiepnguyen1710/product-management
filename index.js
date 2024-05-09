const express = require("express");
var bodyParser = require('body-parser')
const mongoose = require("mongoose");
const database = require ("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require('method-override');
var flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');
require("dotenv").config();

database.connect();

const app = express();
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

const port = process.env.PORT;


app.set("views", "./views");
app.set("view engine", "pug");

// Flash
app.use(cookieParser('JHSVBDSDSD'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End Flash

app.use(express.static("public"));

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})