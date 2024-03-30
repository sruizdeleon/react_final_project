import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import PeliculaDetalle from "../../components/peliculaDetalle/PeliculaDetalle";
import Pelicula from "../../components/pelicula/Pelicula";
import swal from "sweetalert";
import axios from "axios";
import "./Films.css";

const Films = () => {
	const { user, saveTime, logout } = useContext(SessionContext);
	const [peliculas, setPeliculas] = useState(null);
	const [visibleDetallePelicula, setVisibleDetallePelicula] = useState(false);
	const [peliculaAConsultar, setPeliculaAConsultar] = useState(false);

	useEffect(() => {
		const horaActual = saveTime();
		if (user && horaActual - user.time < 60) {
			obtenerPeliculas();
		} else {
			logout();
		}
	}, []);

	useEffect(() => {
		setPeliculas(peliculas);
	}, [peliculas]);

	function obtenerPeliculas() {
		axios
			.get(`http://localhost:3000/api/films?token=${user.token}`)
			.then((response) => {
				setPeliculas(response.data);
			})
			.catch((error) => {
				if (error.message === "Network Error") {
					swal({
						icon: "error",
						title: "Error",
						text: "No se ha podido obtener las películas de la base de datos. Error en el servidor, prueba de nuevo más tarde.",
						cancel: "Cerrar",
					});
				} else {
					swal({
						icon: "error",
						title: "Error",
						text: `No se ha podido obtener las películas de la base de datos. Error: ${error.response?.data.msg}`,
						cancel: "Cerrar",
					});
				}
			});
	}

	function verPelicula(pelicula) {
		setVisibleDetallePelicula(true);
		setPeliculaAConsultar(pelicula);
	}

	function visibilidadDetallePelicula(estado) {
		return setVisibleDetallePelicula(estado);
	}


	return (
	<>
		<h1 className="page__title">¡Descubre los últimos estrenos!</h1>
		<section className="cards-section">
			{peliculas
				? peliculas.map((p) => (
						<Pelicula
							key={p._id}
							tipoDeUsuario={false}
							pelicula={p}
							onVerPelicula={verPelicula}
						></Pelicula>
				))
				: ""}
		</section>
		<PeliculaDetalle
			tipoDeUsuario={false}
			peliculaAConsultar={peliculaAConsultar}
			visibleDetallePelicula={visibleDetallePelicula}
			onVisibilidadDetallePelicula={visibilidadDetallePelicula}
		></PeliculaDetalle>
	</>
)};

export default Films;
