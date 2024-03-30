import { useContext, useState } from "react";
import swal from "sweetalert";
import axios from 'axios'
import { SessionContext } from "../../contexts/SessionContext";
import "./LoginForm.css"

const LoginForm = () => {
	const DATOSDEFAULT = { email: "", password: "" };
	const [datos, setDatos] = useState(DATOSDEFAULT)
	const {login , saveTime} = useContext(SessionContext)

	function doLogin() {
		axios.post('http://localhost:3000/api/users/login', datos).then((response)=>{
			const horaLogin = saveTime()
			login({
				email: datos.email,
				token: response.data.token,
				role: response.data.role,
				name: response.data.name,
				time: horaLogin,
			});
			swal({
				icon: "success",
				title: `¡Hola de nuevo ${response.data.name}!`,
				button: "Cerrar"
			});
			console.log({email: datos.email, token: response.data.token, role: response.data.role, name: response.data.name, time: horaLogin})
		}).catch((error)=>{
			if (error.message === "Network Error") {
				swal({
					icon: "error",
					title: "Error",
					text: "No se ha podido iniciar sesión. Error en el servidor, prueba de nuevo más tarde.",
					cancel: "Cerrar",
				});
			} else {
				swal({
					icon: "error",
					title: "Error",
					text: `No se ha podido iniciar sesión. Error: ${error.response?.data.msg}`,
					cancel: "Cerrar",
				});
			}
			setDatos(DATOSDEFAULT);
		})
	}

	return (
		<>
			<div className="loginform f-c-c-c">
				<div className="loginform__header f-c-c-c">
					<h1 className="loginform__title">Login</h1>
				</div>
				<div className="loginform__body f-c-c-c">
					<div className="loginform__item-group f-c-c-l">
						<label htmlFor="email" className="loginform__label">
							Email
						</label>
						<input
							className="loginform__input"
							value={datos.email}
							onChange={(e) => setDatos({ ...datos, email: e.target.value })}
							type={"email"}
							id="email"
							name="email"
						></input>
					</div>
					<div className="loginform__item-group f-c-c-l">
						<label htmlFor="password" className="loginform__label">
							Password
						</label>
						<input
							className="loginform__input"
							value={datos.password}
							onChange={(e) => setDatos({ ...datos, password: e.target.value })}
							type="password"
							id="password"
							name="password"
						></input>
					</div>
				</div>
				<div className="loginform__footer f-c-c-c">
					<button onClick={doLogin} type="submit" className="loginform__button">
						Login
					</button>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
