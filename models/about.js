const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// установка схемы

const aboutScheme = new Schema({
	text: String
});

module.exports = mongoose.model("about", aboutScheme);