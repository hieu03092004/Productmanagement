const flash = require("express-flash");
const moment = require("moment");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const express = require("express");
//const { createServer } = require('node:http');
const path = require("path");
const route = require("./routes/client/index.route.js");
const routeAdmin = require("./routes/admin/index.route.js");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");

const methodOverride = require("method-override");
const app = express();

require("dotenv").config();
const database = require("./config/database.js");
const systemConfig = require("./config/system.js");
// app local variables
//bien trong file js co the truyen vao bat cu file nao trong pug
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
//end app local variables
database.connect();
// socketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//end flash
// tiny mce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// end tiny mce
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", `${_dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
//route
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
  res.render("client/pages/errors/404.pug", {
    pageTitle: "404 NOT FOUND",
  });
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
