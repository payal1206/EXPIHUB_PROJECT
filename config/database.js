const mongoose = require("mongoose");

const url = process.env.db_uri;
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: true,
});

const connection = mongoose.connection;

// const connection = mongoose.connection;
connection
	.once("open", () => {
		console.log("Database connected...");
	})
	.catch((err) => {
		console.log("Connection failed...");
	});

module.exports = connection;