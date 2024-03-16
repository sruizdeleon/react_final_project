require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const filmRoutes = require("./routes/film.routes");

const app = express();

app.use(cors());

app.use(express.json());

mongoose
	.connect(process.env.DB_USER)
	.then(() => {
		console.log(`Conexion con base de datos exitosa`);
	})
	.catch((err) => {
		console.log(`Error al conectar con la base de datos: ${err}`);
	});

app.use("/api/users", userRoutes);
app.use("/api/films", filmRoutes);

app.listen(process.env.PORT, () => {
	console.log(`API funcionado... en puerto 3000`);
});
