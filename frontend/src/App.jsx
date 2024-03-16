import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/login";
import Signup from "./pages/singup/Signup";
import Films from "./pages/films/Films";
import Home from "./pages/home/Home";
import { useContext } from "react";
import { SessionContext } from "./contexts/SessionContext";
import Admin from "./pages/admin/Admin";

function App() {
	const { user, logout } = useContext(SessionContext);

	function changeLang(e) {
		console.log(e.target.value);
		i18n.changeLanguage(e.target.value);
	}

	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<select id='lang-selector' name="lang-selector" onChange={changeLang}>
								<option value="es">español</option>
								<option value="en">ingles</option>
								<option value="fr">frances</option>
							</select>
						</li>
						{user ? (
							""
						) : (
							<li>
								<Link to="/login">Login</Link>
							</li>
						)}
						{user ? (
							""
						) : (
							<li>
								<Link to="/signup">Singup</Link>
							</li>
						)}
						{user ? (
							<li>
								<Link to="/films">Películas</Link>
							</li>
						) : (
							""
						)}
						{user && user.role === "admin" ? (
							<li>
								<Link to="/admin">Admin</Link>
							</li>
						) : (
							""
						)}
						{user ? <button onClick={logout}>Logout</button> : ""}
					</ul>
				</nav>
			</header>

			<main>
				<Routes>
					<Route path="/" element={<Home></Home>}></Route>
					<Route path="/login" element={user ? <Navigate to="/films"></Navigate> : <Login></Login>}></Route>
					<Route
						path="/signup"
						element={user ? <Navigate to="/films"></Navigate> : <Signup></Signup>}
					></Route>
					<Route path="/films" element={user ? <Films></Films> : <Navigate to="/login"></Navigate>}></Route>
					<Route
						path="/admin"
						element={user && user.role === "admin" ? <Admin></Admin> : <Navigate to="/login"></Navigate>}
					></Route>
				</Routes>
			</main>
		</>
	);
}

export default App;
