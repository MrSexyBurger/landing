const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// установка схемы

const clientsScheme = new Schema({
	href: String
});

module.exports = mongoose.model("clients", clientsScheme);