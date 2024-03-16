import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import './Admin.css'
import axios from "axios";
import PeliculaAdmin from "../../components/peliculaAdmin/PeliculaAdmin";
import PeliculaForm from "../../components/peliculaForm/peliculaForm";

const Admin = () => {
	const { user, saveTime, logout } = useContext(SessionContext);
	const [ peliculas, setPeliculas ] = useState(null);
	const [ msgFetch, setMsgFetch] = useState(null);
	const [ visibleFormPelicula, setVisibleFormPelicula] = useState(false);
	const [ peliculaAModificar, setPeliculaAModificar] = useState(false);
	const [ feedbackMsg, setFeedbackMsg] = useState(null)



	useEffect(() => {
		const horaActual = saveTime();
		if (user && horaActual - user.time < 60) {
			obtenerPeliculas();
		} else {
			logout();
		}
	}, []);

	function obtenerPeliculas() {
        axios
			.get(`http://localhost:3000/api/films?token=${user.token}`)
			.then((response) => {
				setPeliculas(response.data);
				console.log(response.data);
			})
			.catch((error) => {
				if (error.message === "Network Error") {
					setFeedbackMsg("Error en el servidor. Inténtalo más tarde.");
				} else {
					setFeedbackMsg(error.response.data.msg);
				}
			});
	}

	function agregarPelicula(objeto) {
		console.log("Agregando pelicula", objeto)
		setPeliculas([...peliculas, objeto])
	}

	function pasarPeliculaAModificar (pelicula) {
		setPeliculaAModificar(pelicula);
		setVisibleFormPelicula(true);
	}

	function borrarPelicula(id) {
		axios
			.delete(`http://localhost:3000/api/films/${id}?token=${user.token}`)
			.then((response) => {
				const index = peliculas.findIndex((pelicula) => pelicula._id === id)
				if (index !== -1) {
					peliculas.splice(index, 1)
					mostrarMsgFetch(response.data.msg)
				}
			})
			.catch((error) => {
				mostrarMsgFetch("La película no se ha podido eliminar. Prueba más tarde.")
				console.log("Pelicula no borrada", error);
			});
	}

	function mostrarMsgFetch (msg) {
		setMsgFetch(msg);
		setTimeout(()=>{
			setMsgFetch(null)
		}, 2000)
	}

	function onCancelar(dato) {
		return setVisibleFormPelicula(dato);
	}

	return (
		<>
			<h1>Zona administrador</h1>
			<button
				onClick={() => {
					visibleFormPelicula === false ? setVisibleFormPelicula(true) : false;
				}}
			>
				Añadir película
			</button>
			<PeliculaForm
				visibleFormPelicula={visibleFormPelicula}
				onCancelar={onCancelar}
				onSetPeliculas={setPeliculas}
				onAgregarPelicula={agregarPelicula}
				onMostrarMsgFetch={mostrarMsgFetch}
				peliculaAModificar={peliculaAModificar}
			></PeliculaForm>
			<div>
				<button>Filtrar</button>
			</div>
			{msgFetch ? (
				<div>
					<p>{msgFetch}</p>
				</div>
			) : (
				""
			)}
			{msgFetch ? (
				<div>
					<p>{msgFetch}</p>
				</div>
			) : (
				""
			)}
			<section className="cards-section">
				{peliculas
					? peliculas.map((p) => (
							<PeliculaAdmin
								key={p._id}
								pelicula={p}
								borrarPelicula={borrarPelicula}
								onPasarPeliculaAModificar={pasarPeliculaAModificar}
							></PeliculaAdmin>
					  ))
					: ""}
			</section>
		</>
	);
};

export default Admin;
