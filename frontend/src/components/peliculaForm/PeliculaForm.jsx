import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import axios from "axios";
import { useCookies } from "react-cookie";

const PeliculaForm = ({
	visibleFormPelicula,
	onCancelar,
	onAgregarPelicula,
	onMostrarMsgFetch,
	peliculaAModificar, // Como pasar peliculas a modificar.
}) => {
	const [cookie, setCookie, removeCookie] = useCookies(["addFilmForm"]);
	const { user, saveTime, logout } = useContext(SessionContext);
	const [datos, setDatos] = useState({
		title: null,
		synopsis: null,
		year: null,
		duration: null,
		director: null,
		categories: [],
		platforms: [],
		images: { cartel: null, poster: null },
	});

	const categoriesOptions = [
		"Acción",
		"Comedia",
		"Drama",
		"Ciencia ficción",
		"Animación",
		"Aventura",
		"Suspense",
		"Terror",
		"Documental",
	];

	const platformOptions = ["Netflix", "HBO", "Prime Video", "Disney+", "Movistar+", "Apple TV"];

	useEffect(() => {
		if (cookie.addFilmForm) {
			setDatos(cookie.addFilmForm);
		}
	}, []);

	function categoriesCheckbox(array, event) {
		const selection = event.target.value;
		if (array.indexOf(selection) === -1) {
			array.push(selection);
			setDatos({ ...datos, categories: array });
		} else {
			array.splice(array.indexOf(selection), 1);
			setDatos({ ...datos, categories: array });
		}
	}

	function platformsCheckbox(array, event) {
		const selection = event.target.value;
		if (array.indexOf(selection) === -1) {
			array.push(selection);
			setDatos({ ...datos, platforms: array });
		} else {
			array.splice(array.indexOf(selection), 1);
			setDatos({ ...datos, platforms: array });
		}
	}

	const handleFormSubmit = (event) => {
		event.preventDefault();
		setCookie("addFilmForm", datos);
		const horaActual = saveTime();
		if (user && horaActual - user.time < 60) {
			axios
				.post(`http://localhost:3000/api/films?token=${user.token}`, datos)
				.then((response) => {
					onAgregarPelicula({ ...datos, _id: response.data.data._id });
				})
				.catch((error) => {
					if (error.message === "Network Error") {
						onMostrarMsgFetch("Error en el servidor. Inténtalo más tarde.");
					} else {
						onMostrarMsgFetch(error.response?.data.msg);
					}
				});
		} else {
			logout();
		}
	};

	return (
		<form style={{ display: visibleFormPelicula ? "block" : "none" }} onSubmit={handleFormSubmit}>
			<div>
				<label htmlFor="title">Título:</label>
				<input
					id="title"
					type="text"
					value={datos.title ? datos.title : ""}
					onChange={(e) => setDatos({ ...datos, title: e.target.value })}
				/>
			</div>
			<div>
				<label htmlFor="synopsis">Sinopsis:</label>
				<textarea
					id="synopsis"
					value={datos.synopsis ? datos.synopsis : ""}
					onChange={(e) => setDatos({ ...datos, synopsis: e.target.value })}
				></textarea>
			</div>
			<div>
				<label htmlFor="duration">Duración:</label>
				<input
					id="duration"
					type="number"
					value={datos.duration ? datos.duration : ""}
					onChange={(e) => setDatos({ ...datos, duration: e.target.value })}
				/>
			</div>
			<div>
				<label htmlFor="year">Año:</label>
				<input
					id="year"
					type="number"
					value={datos.year ? datos.year : ""}
					onChange={(e) => setDatos({ ...datos, year: e.target.value })}
				/>
			</div>
			<div>
				<label htmlFor="director">Director:</label>
				<input
					id="director"
					type="text"
					value={datos.director ? datos.director : ""}
					onChange={(e) => setDatos({ ...datos, director: e.target.value })}
				/>
			</div>
			<div>
				<legend htmlFor="categories">Categoría:</legend>
				<br />
				{categoriesOptions.map((cat, i) => (
					<div key={i} id="categories">
						<input type="checkbox" onChange={(e) => categoriesCheckbox(datos.categories, e)} id={cat} />
						<label htmlFor={cat}>{cat}</label>
					</div>
				))}
			</div>
			<div>
				<legend>Plataformas:</legend>
				<br />
				{platformOptions.map((platform, i) => (
					<div key={i} id="platform">
						<input
							type="checkbox"
							onChange={(e) => platformsCheckbox(datos.platforms, e)}
							id={platform}
							value={platform}
							platformame={platform}
						/>
						<label htmlFor={platform}>{platform}</label>
					</div>
				))}
			</div>
			<div>
				<label htmlFor="poster">Póster:</label>
				<input
					id="poster"
					type="url"
					value={datos.images.poster ? datos.images.poster : ""}
					onChange={(e) =>
						setDatos({ ...datos, images: { cartel: datos.images.cartel, poster: e.target.value } })
					}
				/>
			</div>
			<div>
				<label htmlFor="cartel">Cartel:</label>
				<input
					id="cartel"
					type="url"
					value={datos.images.cartel ? datos.images.cartel : ""}
					onChange={(e) =>
						setDatos({ ...datos, images: { poster: datos.images.poster, cartel: e.target.value } })
					}
				/>
			</div>
			<button type="submit">Añadir</button>
			<button
				type="button"
				onClick={() => {
					setDatos({
						title: null,
						synopsis: null,
						year: null,
						duration: null,
						director: null,
						categories: [],
						platforms: [],
						images: { cartel: null, poster: null },
					});
				}}
			>
				Limpiar
			</button>
			<button
				type="button"
				onClick={() => {
					visibleFormPelicula === true ? onCancelar(false) : false;
				}}
			>
				Cancelar
			</button>
		</form>
	);
};

export default PeliculaForm;
