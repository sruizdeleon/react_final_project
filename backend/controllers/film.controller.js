require("dotenv").config();
const Film = require("../models/film.model");
const jwt = require("jsonwebtoken");

async function findAllFilms(req, res) {
	try {
		const films = await Film.find();
		return res.json(films);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al buscar las películas" });
	}
}

async function insertFilm(req, res) {
	try {
		const token = req.query.token;
		const tokenDecoded = jwt.verify(token, process.env.DB_PASSWORD);
		const userId = tokenDecoded.userId;
		const newFilm = new Film({
			title: req.body.title,
			synopsis: req.body.synopsis,
			director: req.body.director,
			year: req.body.year,
			duration: req.body.duration,
			platforms: req.body.platforms,
			images: { poster: req.body.images.poster, cartel: req.body.images.cartel },
			categories: req.body.categories,
			userId: userId,
		});

		await newFilm.save();
		return res.json({ msg: "pelicula guardada" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al guardar la película" });
	}
}

async function deleteOneFilm(req, res) {
	try {
		await Film.findByIdAndDelete(req.params.id);
		return res.json({ msg: "pelicula eliminada" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al eliminar la película" });
	}
}

module.exports = {
	findAllFilms,
	insertFilm,
	deleteOneFilm,
};
