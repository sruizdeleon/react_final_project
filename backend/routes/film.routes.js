const express = require("express")
const router = express.Router()
const {findAllFilms, insertFilm, modifyFilm, deleteOneFilm} = require("../controllers/film.controller")
const {isAuthenticated , isAdmin} = require("../middlewares/auth.middleware")

router.get("/", isAuthenticated, findAllFilms)
router.post("/", isAdmin, insertFilm)
router.patch("/:id", isAdmin, modifyFilm);
router.delete("/:id", isAdmin, deleteOneFilm)

module.exports = router