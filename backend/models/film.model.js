const mongoose = require("mongoose")

const filmSchema = new mongoose.Schema({
	title: { type: String, required: true },
	year: { type: Number, required: true },
	synopsis: { type: String, required: false },
	director: { type: String, required: false },
	duration: { type: Number, required: true },
	images: {
        poster: { type: String, required: false },
		cartel: { type: String, required: false },
    },
	categories: [
		{
			type: String,
			required: false,
		},
	],
	platforms: [
		{
			type: String,
			required: false,
		},
	],
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "users",
		required: false,
	},
});

module.exports = mongoose.model("films", filmSchema)