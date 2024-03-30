import "./Pelicula.css";
const Pelicula = ({ pelicula, onBorrarPelicula, onEditarPelicula, onVerPelicula, tipoDeUsuario, onClicEnEditar }) => {
	return (
		<article className="card">
			{pelicula.images ? (
				<div className="card__header">
					<img className="card__image" src={pelicula.images.poster}></img>
				</div>
			) : (
				""
			)}
			<div className="card__body f-c-c-c">
				<p className="card__title">{pelicula.title}</p>
				<div></div>
			</div>
			<div className="card__footer">
				<button className="card__button card__button--see" onClick={() => onVerPelicula(pelicula)}>
					Ver más
				</button>
				{tipoDeUsuario === "admin" ? (
					<>
						<button
							className="card__button card__button--edit"
							onClick={() => {
								onClicEnEditar(true);
								onEditarPelicula(pelicula);
							}}
						>
							Editar
						</button>
						<button
							className="card__button card__button--delete"
							onClick={() => onBorrarPelicula(pelicula)}
						>
							Borrar
						</button>
					</>
				) : (
					""
				)}
			</div>
		</article>
	);
};

export default Pelicula;
