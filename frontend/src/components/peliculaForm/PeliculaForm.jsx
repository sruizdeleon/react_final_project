import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { Categories } from "../../models/Categories";
import { Platforms } from "../../models/Platforms";
import swal from "sweetalert"
import InputValidation from "../shared/InputValidation";
import axios from "axios";
import { useCookies } from "react-cookie";
import './PeliculaForm.css'
import TextAreaValidation from "../shared/TextAreaValidation";

const PeliculaForm = ({
	visibleFormPelicula,
	setVisibleFormPelicula,
	onCancelar,
	onAgregarPelicula,
	onAgregarPeliculaEditada,
	limpiarDatosFormulario,
	onEstadoLimpiarFormulario,
	peliculaAModificar,
	editarUnaPelicula,
}) => {
	const { user, saveTime, logout } = useContext(SessionContext);
	const [cookie, setCookie, removeCookie] = useCookies(["addFilmForm"]);
	const [desableButton, setDesableButton] = useState(true);
	const [validForm, setValidForm] = useState({
		title: false,
		year: false,
		director: false,
		synopsis: false,
		duration: false,
		images: {
			poster: false,
			cartel: false
		},
	});
	const [datos, setDatos] = useState({
		_id: null,
		title: null,
		synopsis: null,
		year: null,
		duration: null,
		director: null,
		categories: new Array(),
		platforms: new Array(),
		images: { cartel: null, poster: null },
	});

	console.log("Estado boton desactivado: ", desableButton)
	console.log("Validación formulario: ", validForm)

	const categoriesOptions = Categories;
	const platformOptions = Platforms;

	useEffect(() => {
		if (cookie.addFilmForm) {
			setDatos(cookie.addFilmForm);
		}
	}, []);

	useEffect(() => {
		setDatos(peliculaAModificar);
	}, [editarUnaPelicula]);

	useEffect(() => {
		if (limpiarDatosFormulario === true) {
			setDatos({
				_id: null,
				title: null,
				synopsis: null,
				year: null,
				duration: null,
				director: null,
				categories: new Array(),
				platforms: new Array(),
				images: { cartel: null, poster: null },
			});
			onEstadoLimpiarFormulario(false);
		}
	}, [limpiarDatosFormulario]);

	useEffect(() => {
		let statusArray = new Array();
		for (let value in validForm) {
			validForm[value] ? statusArray.push(true) : statusArray.push(false);
		}
		const statusValidation = !statusArray.includes(false);
		console.log("Estado de la validación global", statusValidation);
		statusValidation ? setDesableButton(false) : setDesableButton(true);
	}, [datos]);

	useEffect(() => {
		setCookie("filmForm", datos);
	}, [datos]);

	function limpiarDatos() {
		swal({
			title: "Limpiar datos",
			text: `¿Seguro que quieres limpiar los datos del formulario? Perderás todas las modificaciones hechas.`,
			buttons: {
				catch: {
					text: "Limpiar",
					value: "limpiar",
				},
				cancel: "Cancelar",
			},
			icon: "warning",
		}).then((value) => {
			switch (value) {
				case "limpiar":
					setDatos({
						_id: null,
						title: null,
						synopsis: null,
						year: null,
						duration: null,
						director: null,
						categories: new Array(),
						platforms: new Array(),
						images: { cartel: null, poster: null },
					});
					removeCookie("filmForm");
					break;
				case null:
					break;
			}
		});
	}

	function categoriesCheckbox(array, event) {
		console.log(array, event);
		const selection = event.target.value;
		if (array?.indexOf(selection) === -1) {
			console.log("entro en el if", array);
			array.push(selection);
			setDatos({ ...datos, categories: array });
			console.log("entro en el if", array);
		} else {
			console.log("entro en el else", array);
			array?.splice(array.indexOf(selection), 1);
			setDatos({ ...datos, categories: array });
		}
	}

	function platformsCheckbox(array, event) {
		const selection = event.target.value;
		if (array?.indexOf(selection) === -1) {
			array?.push(selection);
			setDatos({ ...datos, platforms: array });
		} else {
			array?.splice(array.indexOf(selection), 1);
			setDatos({ ...datos, platforms: array });
		}
	}

	function handleFormSubmit () {
		console.log(datos);
		const horaActual = saveTime();
		if (user && horaActual - user.time < 60) {
			if (datos._id === null) {
				console.log("entro en el post");
				axios
					.post(`http://localhost:3000/api/films?token=${user.token}`, datos)
					.then((response) => {
						console.log(response)
						onAgregarPelicula({ ...datos, _id: response.data.data._id });
						swal({
							icon: "success",
							title: "Pelicula creada correctamente",
						});
						setDatos({
							_id: null,
							title: null,
							synopsis: null,
							year: null,
							duration: null,
							director: null,
							categories: new Array(),
							platforms: new Array(),
							images: { cartel: null, poster: null },
						});
						setVisibleFormPelicula(false);
					})
					.catch((error) => {
						if (error.message === "Network Error") {
							swal({
								icon: "error",
								title: "Error",
								text: "No se ha podido crear la película. Error en el servidor, prueba de nuevo más tarde.",
								cancel: "Cerrar",
							});
						} else {
							swal({
								icon: "error",
								title: "Error",
								text: `No se ha podido crear la película. Error: ${error.response?.data.msg}`,
								cancel: "Cerrar",
							});
						}
					});
			} else {
				swal({
					title: "Modificar",
					text: `¿Seguro que quieres modificar la película: ${datos.title}?`,
					buttons: {
						catch: {
							text: "Modificar",
							value: "modificar",
						},
						cancel: "Cancelar",
					},
					icon: "warning",
				}).then((value) => {
					console.log(value);
					switch (value) {
						case "modificar":
							axios
								.patch(`http://localhost:3000/api/films/${datos._id}?token=${user.token}`, datos)
								.then((response) => {
									onAgregarPeliculaEditada(datos);
									swal({
										icon: "success",
										title: "Pelicula modificada correctamente",
									});
									setVisibleFormPelicula(false);
								})
								.catch((error) => {
									if (error.message === "Network Error") {
										swal({
											icon: "error",
											title: "Error",
											text: "No se ha podido modificar la película. Error en el servidor, prueba de nuevo más tarde.",
											cancel: "Cerrar",
										});
									} else {
										swal({
											icon: "error",
											title: "Error",
											text: `No se ha podido modificar la película. Error en la modificación: ${error.response?.data.msg}`,
											cancel: "Cerrar",
										});
									}
								});
							break;
						case null:
							swal({
								text: `¡La película ${peliculaMostrada.title} no ha sido modificada!`,
								icon: "info",
								default: true,
							});
							break;
					}
				});
			}
		} else {
			logout();
		}
	};

	function handleFieldValidated(fieldName, status) {
		console.log(fieldName,": ", status)
		const auxValidForm = validForm;
		if (fieldName === "poster" || fieldName === "cartel"){
			auxValidForm.images[fieldName] =status;
		} else {
			auxValidForm[fieldName] = status;
		}
		setValidForm(auxValidForm);
	}

	function interestsCheckbox(array, event) {
		const selection = event.target.value;
		if (array?.indexOf(selection) === -1) {
			array.push(selection);
			setDatos({ ...datos, categories: array });
		} else {
			array?.splice(array.indexOf(selection), 1);
			setDatos({ ...datos, categories: array });
		}
	}


	return (
		<div className="filmform__container f-c-c-c" style={{ display: visibleFormPelicula ? "flex" : "none" }}>
			<form className="filmform">
				<div className="filmform__header">
					{datos && datos._id !== null ? (
						<h3 className="filmform__title">Editando</h3>
					) : (
						<h3 className="filmform__title">Creando</h3>
					)}
					<span>
						<button
							type="button"
							onClick={() => {
								visibleFormPelicula === true ? onCancelar(false) : false;
							}}
							className="filmform__close"
						>
							X
						</button>
					</span>
				</div>
				<div className="filmform__columns f-r-c-c">
					<div className="filmform__column">
						<div className="filmform__item-group f-c-c-l">
							<label className="filmform__label" htmlFor="title">
								Título:
							</label>
							<InputValidation
								className="filmform__input"
								value={datos?.title ? datos?.title : ""}
								onChange={(e) => setDatos({ ...datos, title: e.target.value })}
								type="text"
								id="title"
								name="title"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe tener como mínimo un caracter y máximo 100 caracteres.",
										fn: (p) => /^.{1,100}$/.test(p),
									},
								]}
							/>
						</div>
						<div className="filmform__item-group f-c-c-l">
							<label className="filmform__label" htmlFor="duration">
								Duración:
							</label>
							<InputValidation
								className="filmform__input"
								value={datos?.duration ? datos?.duration : ""}
								onChange={(e) => setDatos({ ...datos, duration: e.target.value })}
								type="number"
								id="duration"
								name="duration"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe durar desde 1 minuto a 999 minutos.",
										fn: (p) => /^([1-9]|[0-9][0-9]|[0-9][0-9][0-9])$/.test(p),
									},
								]}
							/>
						</div>
						<div className="filmform__item-group f-c-c-l">
							<label className="filmform__label" htmlFor="year">
								Año:
							</label>
							<InputValidation
								className="filmform__input"
								value={datos?.year ? datos?.year : ""}
								onChange={(e) => setDatos({ ...datos, year: e.target.value })}
								type="number"
								id="year"
								name="year"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe ser un año entre 1900 y 2029.",
										fn: (p) => /^(19[0-9][0-9]|20[0-2][0-9])$/.test(p),
									},
								]}
							/>
						</div>
						<div className="filmform__item-group f-c-c-l">
							<label className="filmform__label" htmlFor="director">
								Director:
							</label>
							<InputValidation
								className="filmform__input"
								value={datos?.director ? datos?.director : ""}
								onChange={(e) => setDatos({ ...datos, director: e.target.value })}
								type="text"
								id="director"
								name="director"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe tener como mínimo un caracter y máximo 100 caracteres.",
										fn: (p) => /^.{1,100}$/.test(p),
									},
								]}
							/>
						</div>
						<div className="img-sample">
							<div className="img-sample__text-container f-c-c-l">
								<label className="filmform__label" htmlFor="poster">
									Póster:
								</label>
								<InputValidation
									className="filmform__input"
									value={datos.images?.poster ? datos.images.poster : ""}
									onChange={(e) => setDatos({ ...datos, poster: e.target.value })}
									type="url"
									id="poster"
									name="poster"
									onHandleFieldValidated={handleFieldValidated}
									rules={[
										{
											text: "Debe ser una url comenzando por http...",
											fn: (p) => /^http.*$/.test(p),
										},
										{
											text: "Debe tener como mínimo 7 caracteres y máximo 300 caracteres.",
											fn: (p) => /^.{7,300}$/.test(p),
										},
									]}
								/>
							</div>
							{datos?.images?.poster ? (
								<div className="img-sample__img-container f-c-c-r">
									<img className="img-sample__img" src={datos.images.poster}></img>
								</div>
							) : (
								""
							)}
						</div>
						<div className="img-sample">
							<div className="img-sample__text-container f-c-c-l">
								<label className="filmform__label" htmlFor="cartel">
									Cartel:
								</label>
								<InputValidation
									className="filmform__input"
									value={datos.images?.cartel ? datos.images.cartel : ""}
									onChange={(e) => setDatos({ ...datos, cartel: e.target.value })}
									type="url"
									id="cartel"
									name="cartel"
									onHandleFieldValidated={handleFieldValidated}
									rules={[
										{
											text: "Debe ser una url comenzando por http...",
											fn: (p) => /^http.*$/.test(p),
										},
										{
											text: "Debe tener como mínimo 7 caracteres y máximo 300 caracteres.",
											fn: (p) => /^.{7,300}$/.test(p),
										},
									]}
								/>
							</div>

							{datos?.images?.cartel ? (
								<div className="img-sample__img-container f-c-c-r">
									<img className="img-sample__img" src={datos.images.cartel}></img>
								</div>
							) : (
								""
							)}
						</div>
					</div>
					<div className="filmform__column">
						<div className="filmform__item-group f-c-c-c">
							<legend className="filmform__label" htmlFor="categories">
								Categoría:
							</legend>
							<div className="filmform__checkbox-section">
								{categoriesOptions?.map((category, i) => (
									<div key={i} id="categories" className="filmform__checkbox-group">
										<input
											className="filmform__checkbox"
											type="checkbox"
											onChange={(e) => categoriesCheckbox(datos.categories, e)}
											id={category}
											value={category}
											checked={
												datos && datos.categories && datos.categories.includes(category)
													? true
													: false
											}
										/>
										<label className="filmform__checkbox-label" htmlFor={category}>
											{category}
										</label>
									</div>
								))}
							</div>
						</div>
						<div className="filmform__item-group f-c-c-l">
							<legend className="filmform__label" htmlFor="platform">
								Plataformas:
							</legend>
							<div className="filmform__checkbox-section">
								{platformOptions.map((platform, i) => (
									<div key={i} id="platform" className="filmform__checkbox-group">
										<input
											className="filmform__checkbox"
											type="checkbox"
											onChange={(e) => platformsCheckbox(datos.platforms, e)}
											id={platform}
											value={platform}
											checked={
												datos && datos.platforms && datos.platforms.includes(platform)
													? true
													: false
											}
										/>
										<label className="filmform__checkbox-label" htmlFor={platform}>
											{platform}
										</label>
									</div>
								))}
							</div>
						</div>
						<div className="filmform__item-group f-c-c-l">
							<label className="filmform__label" htmlFor="synopsis">
								Sinopsis:
							</label>
							<TextAreaValidation
								className="filmform__text-area"
								value={datos?.synopsis ? datos?.synopsis : ""}
								onChange={(e) => setDatos({ ...datos, synopsis: e.target.value })}
								type="textarea"
								id="synopsis"
								name="synopsis"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe tener como mínimo diez caracteres y máximo 1000 caracteres.",
										fn: (p) => /^.{10,1000}$/.test(p),
									},
								]}
							/>
						</div>
					</div>
				</div>
				<div className="filmform__footer f-r-c-c">
					<button
						className="filmform__button card__button--complete"
						type="button"
						onClick={() => handleFormSubmit()}
						disabled={desableButton}
					>
						{datos?._id === null ? "Añadir película" : "Guardar cambios"}
					</button>
					<button
						className="filmform__button card__button--clean"
						type="button"
						onClick={() => limpiarDatos()}
					>
						Limpiar
					</button>
					<button
						className="filmform__button card__button--cancel"
						type="button"
						onClick={() => {
							visibleFormPelicula === true ? onCancelar(false) : false;
						}}
					>
						Cancelar
					</button>
				</div>
			</form>
		</div>
	);
};

export default PeliculaForm;
