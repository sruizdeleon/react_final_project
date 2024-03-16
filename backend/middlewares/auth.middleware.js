require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function isAuthenticated(req, res, next) {
	const token = req.query.token;
	if (!token) {
		return res.status(401).json({ msg: "no estás autenticado" });
	} else {
		const tokenDecoded = jwt.verify(token, process.env.DB_PASSWORD);
		const userId = tokenDecoded.userId;
		try {
			const foundUser = await User.findById(userId);
			if (!foundUser) {
				return res.status(401).json({ msg: "token no valido" });
			} else {
				next();
			}
		} catch (error) {
			return res.status(401).json({ msg: "token expirado" });
		}
	}
}

async function isAdmin(req, res, next) {
	const token = req.query.token;
	if (!token) {
		return res.status(401).json({ msg: "no estás autenticado" });
	} else {
		const tokenDecoded = jwt.verify(token, process.env.DB_PASSWORD);
		const userId = tokenDecoded.userId;
		try {
			const foundUser = await User.findById(userId);
			if (!foundUser) {
				return res.status(401).json({ msg: "token no valido" });
			} else {
				if (foundUser.role !== "admin") {
					return res.status(403).json({ msg: "no autorizado" });
				} else {
					next();
				}
			}
		} catch (error) {
			return res.status(401).json({ msg: "token expirado" });
		}
	}
}

module.exports = {
	isAuthenticated,
	isAdmin,
};
