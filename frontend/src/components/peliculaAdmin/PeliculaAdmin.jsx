import './PeliculaAdmin.css'
const PeliculaAdmin = ({ pelicula, borrarPelicula, onPasarPeliculaAModificar }) => {
	return (
		<article className="card">
			{pelicula.images ? (
				<div className="card__header">
					<img className="card__image" src={pelicula.images.poster}></img>
				</div>
			) : (
				""
			)}
			<div className="card__body">
				<p className="card__title">{pelicula.title}</p>
				<div></div>
			</div>
			<div className="card__footer">
				<button className="button">Ver más</button>
				<button className="button" onClick={() => onPasarPeliculaAModificar(pelicula)}>
					Editar
				</button>
				<button className="button" onClick={() => borrarPelicula(pelicula._id)}>
					Borrar
				</button>
			</div>
		</article>
	);
};

export default PeliculaAdmin;
