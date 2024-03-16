import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputValidation from "../shared/InputValidation";

const SignupForm = () => {

	const [datos, setDatos] = useState({email: "", password: "", name: ""})
	const [errorMsg, setErrorMsg] = useState(null);
	const navegate = useNavigate()

	function onSignUp() {
		axios.post('http://localhost:3000/api/users/signup', datos)
		.then((response)=>{
			navegate('/login')
		})
		.catch((error)=>{
			if (error.message === "Network Error") {
				setErrorMsg("Error en el servidor. Inténtalo más tarde.");
			} else {
				setErrorMsg(error.response.data.msg);
			}
		})
	}

    return (
		<>
			<div className="container mt-5">
				<div className="row justify-content-center">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h2 className="text-center">Register</h2>
							</div>
							<div className="card-body">
								<div>
									<div className="d-grid gap-2">
										{errorMsg ? <p className="alert alert-danger">{errorMsg}</p> : ""}
									</div>
									<div className="mb-3">
										<label htmlFor="name" className="form-label">
											Nombre
										</label>
										<InputValidation
											value={datos.name}
											onChange={(e) => setDatos({ ...datos, name: e.target.value })}
											type={"text"}
											id="name"
											name="name"
										></InputValidation>
									</div>
									<div className="mb-3">
										<label htmlFor="email" className="form-label">
											Email
										</label>
										<InputValidation
											rules={[
												{ text: "Longitud mínima 8 caracteres.", fn: (p) => p.length >= 1 },
												{ text: "Tiene que contener un @", fn: (p) => p.includes("@") },
											]}
											value={datos.email}
											onChange={(e) => setDatos({ ...datos, email: e.target.value })}
											type={"email"}
											id="email"
											name="email"
										></InputValidation>
									</div>
									<div className="mb-3">
										<label htmlFor="password" className="form-label">
											Contraseña
										</label>
										<InputValidation
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
													text: "Debe contener al menos un dígito.",
													fn: (p) => /\d/.test(p),
												},
												{
													text: "Debe contener sólo uno de estos caracteres especiales: @$*. , : ;",
													fn: (p) =>
														/^(?=.*[a-zA-ZñÑ])(?=.*\d)(?=.*[@$*.,:;])[a-zA-ZñÑ\d@$*.,:;]+$/.test(
															p
														),
												},
												{
													text: "Debe tener entre 8 y 15 caracteres.",
													fn: (p) => /^.{8,15}$/.test(p),
												},
											]}
											value={datos.password}
											onChange={(e) => setDatos({ ...datos, password: e.target.value })}
											type={"password"}
											id="password"
											name="password"
										></InputValidation>
									</div>
									<div className="d-grid gap-2">
										<button onClick={onSignUp} type="submit" className="btn btn-primary">
											Registrar
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SignupForm
