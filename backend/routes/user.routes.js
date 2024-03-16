const express = require("express")
const router = express.Router()
const {login, signup, getAllUsers, deleteOneUser} = require("../controllers/user.controller")
const { isAdmin } = require("../middlewares/auth.middleware");

router.get("/", getAllUsers)
router.post("/signup", signup)
router.post("/login", login)
router.delete("/:id", deleteOneUser);

module.exports = router