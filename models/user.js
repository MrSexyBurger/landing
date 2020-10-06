const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// установка схемы

const userScheme = new Schema({
	name: String,
	phone: String,
	vk: String,
	email: String,
	password: String,
	about: String,
	youtube: String
});

module.exports = mongoose.model("user", userScheme);