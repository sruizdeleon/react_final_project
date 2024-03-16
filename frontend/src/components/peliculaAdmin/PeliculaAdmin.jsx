import './PeliculaAdmin.css'
const PeliculaAdmin = ({ pelicula, borrarPelicula }) => {

    function borrar () {
        borrarPelicula(pelicula._id)
    }

    return (
		<article className="card">
			{
				pelicula.images?
					<div className="card__header">
						<img className="card__image" src={pelicula.images.poster}></img>
					</div>
					: ""
			}
			<div className="card__body">
				<p className="card__title">{pelicula.title}</p>
				<div>

				</div>
			</div>
			<div className="card__footer">
				<button className="button">Ver más</button>
				<button className="button">Editar</button>
				<button className="button" onClick={borrar}>Borrar</button>
			</div>
		</article>
	);
};

export default PeliculaAdmin;
