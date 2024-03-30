const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	surname: { type: String, required: true },
	birthDate: { type: String, required: false },
	interests: [{ type: String, required: false }],
	role: { type: String, required: false },
	enabled: { type: Boolean, required: true, defaultValue: true },
});

module.exports = mongoose.model("users", userSchema)