import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Categories } from "../../models/Categories";
import swal from "sweetalert";
import './SignupForm.css';
import InputValidation from "../shared/InputValidation";

const SignupForm = () => {

	const navegate = useNavigate()
	const interestsOptions = Categories;
	const [desableButton, setDesableButton] = useState(true);
	const [validForm, setValidForm] = useState({
		name: false,
		surname: false,
		name: false,
		surname: false,
		email: false,
		password: false,
	})
	const [datos, setDatos] = useState({
		name: "",
		surname: "",
		email: "",
		birthDate: "",
		password: "",
		interests: []
	});

	useEffect(()=>{
		let statusArray = new Array();
		for (let value in validForm) {
			validForm[value] ? statusArray.push(true) : statusArray.push(false);
		}
		const statusValidation = !statusArray.includes(false);
		console.log("Estado de la validación global", statusValidation);
		statusValidation ? setDesableButton(false) : setDesableButton(true);
	}, [datos])

	function onSignUp() {
		console.log(datos)
		axios.post('http://localhost:3000/api/users/signup', datos)
		.then((response)=>{
			console.log("Respuesta del servidor OK")
			navegate('/login')
			swal({
				icon: "success",
				title: `¡${datos.name} ya formas parte de PlayMe!`,
				text: "Inicia sesión para empezar enterarte de todas las novedades.",
				button: "Cerrar",
			});
		})
		.catch((error)=>{
			if (error.message === "Network Error") {
				swal({
					icon: "error",
					title: "Error",
					text: "No se ha podido crear el registro. Error en el servidor, prueba de nuevo más tarde.",
					cancel: "Cerrar",
				});
			} else {
				swal({
					icon: "error",
					title: "Error",
					text: `No se ha podido realizar el registro. Error: ${error.response?.data.msg}`,
					cancel: "Cerrar",
				});
			}
		})
	}

	function handleFieldValidated (fieldName, status) {
		const auxValidForm = validForm;
		auxValidForm[fieldName] = status;
		setValidForm(auxValidForm);
	}

	function interestsCheckbox(array, event) {
		const selection = event.target.value;
		if (array?.indexOf(selection) === -1) {
			array.push(selection);
			setDatos({ ...datos, interests: array });
		} else {
			array?.splice(array.indexOf(selection), 1);
			setDatos({ ...datos, interests: array });
		}
	}

    return (
		<>
			<div className="signup f-c-c-c">
				<div className="signup__header f-c-c-c">
					<h1 className="signup__title">Register</h1>
				</div>
				<div className="signup__body">
					<div className="signup__column">
						<div className="signup__item-group f-c-c-l">
							<label htmlFor="name" className="signup__label">
								Nombre *
							</label>
							<InputValidation
								className="signup__input"
								value={datos.name}
								onChange={(e) => setDatos({ ...datos, name: e.target.value })}
								type={"text"}
								id="name"
								name="name"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe tener como mínimo un caracter y máximo 100 caracteres.",
										fn: (p) => /^.{1,100}$/.test(p),
									},
								]}
							></InputValidation>
						</div>
						<div className="signup__item-group f-c-c-l">
							<label htmlFor="email" className="signup__label">
								Email *
							</label>
							<InputValidation
								className="signup__input"
								value={datos.email}
								onChange={(e) => setDatos({ ...datos, email: e.target.value })}
								type={"email"}
								id="email"
								name="email"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe tener una longitud mínima de 5 caracteres.",
										fn: (p) => p.length >= 5,
									},
									{
										text: "Tiene que contener un @ para respetar el formato de un email.",
										fn: (p) => p.includes("@"),
									},
								]}
							></InputValidation>
						</div>
						<div className="signup__item-group f-c-c-l">
							<label htmlFor="password" className="signup__label">
								Contraseña *
							</label>
							<InputValidation
								className="signup__input"
								value={datos.password}
								onChange={(e) => setDatos({ ...datos, password: e.target.value })}
								type={"password"}
								id="password"
								name="password"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe contener al menos una letra minúscula.",
										fn: (p) => /[a-zñ]/.test(p),
									},
									{
										text: "Debe contener al menos una letra mayúscula.",
										fn: (p) => /[A-ZÑ]/.test(p),
									},
									{
										text: "Debe contener al menos un número.",
										fn: (p) => /\d/.test(p),
									},
									{
										text: "Debe contener, al menos, uno de estos caracteres especiales: @ $ *. , : ;",
										fn: (p) => /[@$*.,:;]/.test(p),
									},
									{
										text: "Debe tener entre 8 y 15 caracteres.",
										fn: (p) => /^.{8,15}$/.test(p),
									},
								]}
							></InputValidation>
						</div>
						<div className="signup__item-group f-c-c-l">
							<label htmlFor="birthDate" className="signup__label">
								Fecha de nacimiento
							</label>
							<InputValidation
								className="signup__input"
								value={datos.birthDate}
								onChange={(e) => setDatos({ ...datos, birthDate: e.target.value })}
								type={"date"}
								id="birthDate"
								name="birthDate"
								onHandleFieldValidated={handleFieldValidated}
								rules={[]}
							></InputValidation>
						</div>
					</div>
					<div className="signup__column">
						<div className="signup__item-group f-c-c-l">
							<label htmlFor="surname" className="signup__label">
								Apellidos *
							</label>
							<InputValidation
								className="signup__input"
								value={datos.surname}
								onChange={(e) => setDatos({ ...datos, surname: e.target.value })}
								type={"text"}
								id="surname"
								name="surname"
								onHandleFieldValidated={handleFieldValidated}
								rules={[
									{
										text: "Debe tener como mínimo un caracter y máximo 100 caracteres.",
										fn: (p) => /^.{1,100}$/.test(p),
									},
								]}
							></InputValidation>
						</div>
						<div className="signup__item-group f-c-c-l">
							<legend className="signup__label" htmlFor="interests">
								Intereses:
							</legend>
							<div className="signup__checkbox-section">
								{interestsOptions?.map((interest, i) => (
									<div key={i} id="interests" className="signup__checkbox-group">
										<input
											className="signup__checkbox"
											type="checkbox"
											onChange={(e) => interestsCheckbox(datos.interests, e)}
											id={interest}
											value={interest}
											checked={
												datos && datos.interests && datos.interests.includes(interest)
													? true
													: false
											}
										/>
										<label className="signup__checkbox-label" htmlFor={interest}>
											{interest}
										</label>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="signup__footer f-c-c-c">
					<button onClick={onSignUp} type="submit" className="signup__button" disabled={desableButton}>
						Registrar
					</button>
				</div>
			</div>
		</>
	);
}

export default SignupForm
