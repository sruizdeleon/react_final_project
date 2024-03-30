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

	return (
		<>
			<header className="header">
				<div className="header__container">
					<Link to="/">
						<img className="header__img" src="./src/assets/img/logos/logo-c-l-3-row.png"></img>
					</Link>
					<nav className="nav">
						<ul className="nav__ul">
							{user ? (
								""
							) : (
								<li className="nav__li">
									<Link to="/login">Login</Link>
								</li>
							)}
							{user ? (
								""
							) : (
								<li className="nav__li">
									<Link to="/signup">Singup</Link>
								</li>
							)}
							{user ? (
								<li className="nav__li">
									<Link to="/films">Películas</Link>
								</li>
							) : (
								""
							)}
							{user && user.role === "admin" ? (
								<li className="nav__li">
									<Link to="/admin">Admin</Link>
								</li>
							) : (
								""
							)}
							{user ? (
								<button className="nav__button" onClick={logout}>
									Logout
								</button>
							) : (
								""
							)}
						</ul>
					</nav>
				</div>
				<span className="header__bar"></span>
			</header>

			<main className="main">
				<div className="main__view-container f-c-c-c">
					<Routes>
						<Route path="/" element={<Home></Home>}></Route>
						<Route
							path="/admin"
							element={user?.role === "admin" ? <Admin></Admin> : <Navigate to="/login"></Navigate>}
						></Route>
						<Route
							path="/login"
							element={user ? <Navigate to="/films"></Navigate> : <Login></Login>}
						></Route>
						<Route
							path="/signup"
							element={user ? <Navigate to="/films"></Navigate> : <Signup></Signup>}
						></Route>
						<Route
							path="/films"
							element={user ? <Films></Films> : <Navigate to="/login"></Navigate>}
						></Route>
					</Routes>
				</div>
			</main>
			<footer className="footer f-c-c-c">
				<span className="footer__bar"></span>
				<div className="footer__content-container f-c-c-c">
					<div className="footer__content f-r-c-c">
						<nav className="nav__footer f-c-c-c">
							<h4 className="nav__title">Enlaces de interés:</h4>
							<ul className="nav__ul--footer">
								{user ? (
									""
								) : (
									<li className="nav__li--footer">
										<Link to="/login">Login</Link>
									</li>
								)}
								{user ? (
									""
								) : (
									<li className="nav__li--footer">
										<Link to="/signup">Singup</Link>
									</li>
								)}
								{user ? (
									<li className="nav__li--footer">
										<Link to="/films">Películas</Link>
									</li>
								) : (
									""
								)}
								{user && user.role === "admin" ? (
									<li className="nav__li--footer">
										<Link to="/admin">Admin</Link>
									</li>
								) : (
									""
								)}
								<li className="nav__li--footer">
									<a>Condiciones de uso</a>
								</li>
								<li className="nav__li--footer">
									<a>Protección de datos</a>
								</li>
								<li className="nav__li--footer">
									<a>Política de cookies</a>
								</li>
							</ul>
						</nav>
						<section className="footer__rrss f-c-c-c">
							<h4 className="nav__title">Síguenos en:</h4>
							<ul className="footer__ul-rrss">
								<li className="nav__li--footer">Redes sociales</li>
								<li className="nav__li--footer">Facebook</li>
								<li className="nav__li--footer">Instagram</li>
								<li className="nav__li--footer">Twitter</li>
								<li className="nav__li--footer">Tiktok</li>
							</ul>
						</section>
					</div>
					<div className="footer__copyright-container">
						<p className="footer__copyright">Copyright - 2024</p>
					</div>
				</div>
			</footer>
		</>
	);
}

export default App;
