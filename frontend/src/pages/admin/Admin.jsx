import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { SessionContext } from "../../contexts/SessionContext";
import './Admin.css'
import axios from "axios";
import PeliculaForm from "../../components/peliculaForm/PeliculaForm";
import PeliculaDetalle from "../../components/peliculaDetalle/PeliculaDetalle";
import Pelicula from "../../components/pelicula/Pelicula";

const Admin = () => {
	const { user, saveTime, logout } = useContext(SessionContext);
	const [ peliculas, setPeliculas ] = useState(null);
	const [ visibleFormPelicula, setVisibleFormPelicula] = useState(false);
	const [ peliculaAModificar, setPeliculaAModificar] = useState(false);
	const [ editarUnaPelicula, setEditarUnaPelicula] = useState(false);
	const [ visibleDetallePelicula, setVisibleDetallePelicula] = useState(false);
	const [ peliculaAConsultar, setPeliculaAConsultar] = useState(false);
	const [ limpiarDatosFormulario, setLimpiarDatosFormulario] = useState(false);

	useEffect(() => {
		const horaActual = saveTime();
		if (user && horaActual - user.time < 60) {
			obtenerPeliculas();
		} else {
			logout();
		}
	}, []);

	useEffect(()=>{
		setPeliculas(peliculas)
	},[peliculas])

	useEffect(()=>{
		setEditarUnaPelicula(false);
	},[editarUnaPelicula])


	function obtenerPeliculas() {
        axios
			.get(`http://localhost:3000/api/films?token=${user.token}`)
			.then((response) => {
				setPeliculas(response.data);
				console.log(response.data);
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

	function agregarPelicula(objeto) {
		console.log("Agregando pelicula", objeto)
		setPeliculas([...peliculas, objeto])
	}

	function agregarPeliculaEditada(peliculaEditada) {
		let peliculasActualizadas = peliculas.map((pelicula) => {
			if (pelicula._id === peliculaEditada._id) {
				return peliculaEditada;
			}
			return pelicula;
		});
		setPeliculas(peliculasActualizadas)
		console.log(peliculas)
	}

	function estadoLimpiarFormulario(estado) {
		setLimpiarDatosFormulario(estado);
	}

	function verPelicula(pelicula) {
		setVisibleDetallePelicula(true);
		setPeliculaAConsultar(pelicula);
	}

	function visibilidadDetallePelicula(estado) {
		return setVisibleDetallePelicula(estado);
	}

	function editarPelicula(pelicula) {
		setVisibleFormPelicula(true);
		setPeliculaAModificar(pelicula)
	}

	function clicEnEditar(estado){
		setEditarUnaPelicula(estado)
	}

	function borrarPelicula(pelicula, visibilidadDelDetalle) {
		let id = pelicula._id;
		swal({
			title: "Eliminar película",
			text: `¿Seguro que quieres eliminar ${pelicula.title}?`,
			buttons: {
				catch: {
					text: "Eliminar",
					value: "eliminar",
				},
				cancel: "Cancelar",
			},
			icon: "warning",
		}).then((value) => {
			switch (value) {
				case "eliminar":
					axios
						.delete(`http://localhost:3000/api/films/${id}?token=${user.token}`)
						.then((response) => {
							let arrayPeliculas = new Array();
							peliculas.map((pelicula) => {
								if (pelicula._id !== id) {
									arrayPeliculas.push(pelicula);
								}
							});
							setPeliculas(arrayPeliculas);
							swal({
								icon: "success",
								title: "Pelicula eliminada correctamente",
							});
							visibilidadDelDetalle
								? visibilidadDetallePelicula(false)
								: visibilidadDetallePelicula(false);
						})
						.catch((error) => {
							swal({
								icon: "error",
								title: "Error",
								text: "No se ha podido eliminar la película. Prueba de nuevo más tarde.",
								cancel: "Cerrar",
							});
							visibilidadDelDetalle
								? visibilidadDetallePelicula(true)
								: visibilidadDetallePelicula(false);
						});
					break;
				case null:
					visibilidadDelDetalle
						? visibilidadDetallePelicula(true)
						: visibilidadDetallePelicula(false);
					break;
			}
		});
	}

	function onCancelar(dato) {
		return setVisibleFormPelicula(dato);
	}

	return (
		<>
			<h1 className="page__title">Zona administrador</h1>
			<div className="addFilm__button-container f-c-c-c">
				<button
					onClick={() => {
						visibleFormPelicula === false ? setVisibleFormPelicula(true) : false;
						setLimpiarDatosFormulario(true);
					}}
					className="addFilm__button"
				>
					Añadir película
				</button>
			</div>
			<section className="cards-section">
				{peliculas
					? peliculas.map((p) => (
							<Pelicula
								key={p._id}
								tipoDeUsuario={user.role}
								pelicula={p}
								onBorrarPelicula={borrarPelicula}
								onEditarPelicula={editarPelicula}
								onVerPelicula={verPelicula}
								onClicEnEditar={clicEnEditar}
							></Pelicula>
					  ))
					: ""}
			</section>
			<PeliculaDetalle
				tipoDeUsuario={user.role}
				onBorrarPelicula={borrarPelicula}
				onEditarPelicula={editarPelicula}
				peliculaAConsultar={peliculaAConsultar}
				visibleDetallePelicula={visibleDetallePelicula}
				onVisibilidadDetallePelicula={visibilidadDetallePelicula}
				onClicEnEditar={clicEnEditar}
			></PeliculaDetalle>
			<PeliculaForm
				visibleFormPelicula={visibleFormPelicula}
				setVisibleFormPelicula={setVisibleFormPelicula}
				onCancelar={onCancelar}
				onSetPeliculas={setPeliculas}
				onAgregarPelicula={agregarPelicula}
				onAgregarPeliculaEditada={agregarPeliculaEditada}
				limpiarDatosFormulario={limpiarDatosFormulario}
				editarUnaPelicula={editarUnaPelicula}
				onEstadoLimpiarFormulario={estadoLimpiarFormulario}
				peliculaAModificar={peliculaAModificar}
			></PeliculaForm>
		</>
	);
};

export default Admin;
