require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function getAllUsers(req, res) {
	try {
		const users = await User.find();
		return res.json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al acceder" });
	}
}

async function login(req, res) {
	try {
		const foundUser = await User.findOne({ email: req.body.email });
		if (!foundUser) {
			// no lo he encontrado, el email proporcionado está mal
			return res.status(400).json({ msg: "No existe el usuario o credenciales no válidas" });
		} else {
			const resultCompare = await bcrypt.compare(req.body.password, foundUser.password);
			if (!resultCompare) {
				// la contraseña es incorreta
				return res.status(400).json({ msg: "No existe el usuario o credenciales no válidas" });
			} else {
				const token = jwt.sign({ userId: foundUser._id }, process.env.DB_PASSWORD, { expiresIn: "1h" });
				return res.status(200).json({ msg: "ok", token: token, role: foundUser.role });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al acceder" });
	}
}

// registro
async function signup(req, res) {
	try {
		const hash = await bcrypt.hash(req.body.password, 10);
		const newUser = new User({
			email: req.body.email,
			password: hash,
			name: req.body.name,
			surbame: req.body.surbame,
			birthDate: req.body.birthDate,
			interests: req.body.interests,
			role: "user",
			enabled: true,
		});
		await newUser.save();

		// mailService.send(req.body.email, "")
		return res.json({ msg: "registro correcto" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al registrar" });
	}
}

async function deleteOneUser(req, res) {
	try {
		await User.findByIdAndDelete(req.params.id);
		return res.json({ msg: "usuario eliminado" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al eliminar el usuario" });
	}
}

module.exports = {
	login,
	signup,
	getAllUsers,
	deleteOneUser,
};
