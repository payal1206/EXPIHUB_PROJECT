
require("dotenv").config(); // .env variables
const express      = require("express");
const app          = express();
const ejs          = require("ejs");
const path         = require("path");
const mongoose     = require("mongoose");
const session      = require("express-session");
const passport     = require("passport");
const crypto       = require("crypto"),
	moment         =require("moment"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash"),
	MongoDbStore = require("connect-mongo")(session),
	logger 	   = require("morgan"),
	router       = require("./app"),
	Router       = require("router"),
	connection   = require("./config/database");


// sessions are stored in the db
const sessionStore = new MongoDbStore({
	mongooseConnection: connection,
	collection: "sessions",
});

app.use(
	session({
		secret: "thisismysecret",
		resave: false,
		store: sessionStore,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 24 * 3600 },
	})
);

// need to require full passport.js from config folder
// require("./config/passport");
const passportInit = require("./config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// middle wares
app.use(express.json());
app.use(logger());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use("/", function (req, res, next) {
	//  req.session.user = { 'id': 123 };
	req.session.pageviews = 1;
	next();
});

app.set("view engine", "ejs");
app.use(router);
app.use((req, res) => {
	res.status(404).json({ msg: "Page Not Found!!" });
});
app.use(methodOverride("_method"));
app.use(flash());


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server started listening on port: ${PORT}`);
});