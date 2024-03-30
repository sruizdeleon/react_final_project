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
			creatorUserId: userId,
		});

		const filmSaved = await newFilm.save();
		return res.json({ msg: "pelicula guardada", data: filmSaved });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: "error al guardar la película" });
	}
}


async function modifyFilm(req, res) {
	try {
		const token = req.query.token;
		const tokenDecoded = jwt.verify(token, process.env.DB_PASSWORD);
		const lastModifierUserId = tokenDecoded.userId;
		let parametrosAModificar = new Object();
			req.body.title ? parametrosAModificar["title"] = req.body.title : false
			req.body.synopsis ? parametrosAModificar["synopsis"] = req.body.synopsis : false
			req.body.director ? parametrosAModificar["director"] = req.body.director : false
			req.body.year ? parametrosAModificar["year"] = req.body.year : false
			req.body.duration ? parametrosAModificar["duration"] = req.body.duration : false
			req.body.platforms ? parametrosAModificar["platforms"] = req.body.platforms : false
			req.body.categories ? parametrosAModificar["categories"] = req.body.categories : false
			req.body.images.cartel ?
				req.body.images.poster
					? parametrosAModificar["images"] = {poster: req.body.images.poster, cartel: req.body.images.cartel}
					: parametrosAModificar["images"] = {...images, cartel: req.body.images.cartel}
				: parametrosAModificar["images"] = {...images, poster: req.body.images.poster}
			lastModifierUserId ? parametrosAModificar["lastModifierUserId"] = lastModifierUserId : false
		const lastModifierFilm = await Film.findByIdAndUpdate(req.body._id, parametrosAModificar);
		return res.json({ msg: "pelicula modificada", data: lastModifierFilm });
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
	modifyFilm,
	deleteOneFilm,
};
