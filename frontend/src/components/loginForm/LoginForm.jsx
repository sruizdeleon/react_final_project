import { useContext, useState } from "react";
import axios from 'axios'
import { SessionContext } from "../../contexts/SessionContext";
import InputValidation from "../shared/InputValidation";

const LoginForm = () => {
	const DATOSDEFAULT = { email: "", password: "" };
	const [datos, setDatos] = useState(DATOSDEFAULT)
	const {login , saveTime} = useContext(SessionContext)
	const [errorMsg, setErrorMsg] = useState(null)

	function doLogin() {
		axios.post('http://localhost:3000/api/users/login', datos).then((response)=>{
			const horaLogin = saveTime()
			login({email: datos.email, token: response.data.token, role: response.data.role, time: horaLogin})
			console.log({email: datos.email, token: response.data.token, role: response.data.role, time: horaLogin})
		}).catch((error)=>{
			if(error.message === "Network Error") {
				setErrorMsg("Error en el servidor. Inténtalo más tarde.")
			} else {
				setErrorMsg(error.response.data.msg)
			}
			setDatos(DATOSDEFAULT);
		})
	}

	return (
		<>
			<div className="container mt-5">
				<div className="row justify-content-center">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								<h2 className="text-center">Login</h2>
							</div>
							<div className="card-body">
								<div>
									<div className="mb-3">
										<label htmlFor="email" className="form-label">
											Email address
										</label>
										<InputValidation
											value={datos.email}
											onChange={(e) => setDatos({ ...datos, email: e.target.value })}
											type={"email"}
											id="email"
											name="email"
										></InputValidation>
									</div>
									<div className="mb-3">
										<label htmlFor="password" className="form-label">
											Password
										</label>
										<InputValidation
											value={datos.password}
											onChange={(e) => setDatos({ ...datos, password: e.target.value })}
											type="password"
											id="password"
											name="password"
										></InputValidation>
									</div>
									<div className="d-grid gap-2">
										{errorMsg && datos.email.length === 0 ? (
											<p className="alert alert-danger">{errorMsg}</p>
										) : (
											""
										)}
										<button onClick={doLogin} type="submit" className="btn btn-primary">
											Login
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
};

export default LoginForm;
