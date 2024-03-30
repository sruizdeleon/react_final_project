import "./Home.css";
import { Routes, Route, Link, Navigate } from "react-router-dom";

const Home = () => {
	return (
		<>
			<section className="hero f-c-c-c">
				<div className="hero__content f-c-c-c">
					<img className="hero__img" src="./src/assets/img/logos/logo-c-l-3.png" />
					<p className="hero__text">Encuentra la película que necesitas cuando lo necesitas</p>
				</div>
			</section>
			<section className="action f-r-c-c">
				<article className="action__article f-c-c-c">
					<h2 className="action__title">¿Aún no eres miembro?</h2>
					<p className="action__text">
						Registrate y conoce todas las novedades que van lanzando las distintas plataformas de straming
					</p>
					<Link to={"/signup"}>
						<button className="action__button">Registrarse</button>
					</Link>
				</article>
				<article className="action__article f-c-c-c">
					<h2 className="action__title">¿Ya estás eres miembro?</h2>
					<p className="action__text">Inicia sesión y revisa todas las novedades</p>
					<Link to={"/login"}>
						<button className="action__button">Iniciar sesión</button>
					</Link>
				</article>
			</section>
		</>
	);
};

export default Home;
