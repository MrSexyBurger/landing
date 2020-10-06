const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// установка схемы

const portfolioScheme = new Schema({
	src: String
});

module.exports = mongoose.model("portfolio", portfolioScheme);