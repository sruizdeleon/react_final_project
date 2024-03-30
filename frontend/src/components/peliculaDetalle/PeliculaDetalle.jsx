import { useEffect, useState } from "react";
import "./PeliculaDetalle.css";

const PeliculaDetalle = ({
	peliculaAConsultar,
	visibleDetallePelicula,
	onVisibilidadDetallePelicula,
	onBorrarPelicula,
	onEditarPelicula,
	tipoDeUsuario,
	onClicEnEditar,
}) => {
	const [peliculaMostrada, setPeliculaMostrada] = useState(null);
	const [plataformas, setPlataformas] = useState(null);

	useEffect(() => {
		setPeliculaMostrada(peliculaAConsultar);
	}, [peliculaAConsultar]);

	return (
		<>
			<div
				className="filmdetail__background f-c-c-c"
				style={{ display: visibleDetallePelicula === true ? "flex" : "none" }}
			>
				<section className="filmdetail">
					<div
						className="filmdetail__header f-c-c-c"
						style={{
							backgroundImage: `url(${peliculaAConsultar.images?.cartel})`,
							backgroundRepeat: "no-repeat",
							backgroundSize: "100% auto",
							backgroundPosition: "center",
						}}
					>
						<div className="filmdetail__header-background f-r-c-c">
							<div className="filmdetail__title-container f-c-c-c">
								<h2 className="filmdetail__title">{peliculaAConsultar?.title}</h2>
							</div>
							<div className="filmdetail__close-container">
								<button
									type="button"
									onClick={() => onVisibilidadDetallePelicula(false)}
									className="filmdetail__close f-c-c-c"
								>
									X
								</button>
							</div>
						</div>
					</div>

					{/* BODY */}

					<div className="filmdetail__body">
						<section className="filmdetail__platform-section f-r-c-c">
							{ peliculaAConsultar?.platforms
								? peliculaAConsultar.platforms.map((platform, i) => {
									return (
												<p key={i} className="platform__title">
												{platform}</p>
											)
										})
									: ""
								}
						</section>
						<section className="filmdetail__details-section f-r-c-c">
							<article className="details__img-container f-c-c-c">
								<img src={peliculaAConsultar.images?.poster} className="details__img"></img>
							</article>
							<article className="details__text-container-info">
								<div className="f-c-c-l">
									<label className="details__label">Título</label>
									<p className="details__text">{peliculaAConsultar.title}</p>
								</div>
								<div className="f-c-c-l">
									<label className="details__label">Director</label>
									<p className="details__text">{peliculaAConsultar.director}</p>
								</div>
								<div className="f-c-c-l">
									<label className="details__label">Año de estreno</label>
									<p className="details__text">{peliculaAConsultar.year}</p>
								</div>
								<div className="f-c-c-l">
									<label className="details__label">Duración</label>
									<p className="details__text">{`${peliculaAConsultar.duration} min`}</p>
								</div>
								<div className="f-c-c-l">
									<label className="details__label">Categoría</label>
									<p className="details__text">{peliculaAConsultar.categories?.join(", ") + "."}</p>
								</div>
							</article>
							<article className="details__text-container-synopsis">
								<div className="f-c-c-l">
									<label className="details__label">Sinopsis</label>
									<p className="details__text details__text-synopsis">
										{peliculaAConsultar?.synopsis}
									</p>
								</div>
							</article>
						</section>
					</div>

					{/* FOOTER */}

					<div className="filmdetail__footer f-r-c-c">
						{tipoDeUsuario === "admin" ? (
							<>
								<button
									className="filmdetail__button filmdetail__button-edit"
									type="button"
									onClick={() => {
										onClicEnEditar(true);
										onEditarPelicula(peliculaMostrada);
										onVisibilidadDetallePelicula(false);
									}}
								>
									Editar
								</button>
								<button
									onClick={() => {
										let decition = onBorrarPelicula(peliculaMostrada, visibleDetallePelicula);
										decition ? visibleDetallePelicula(false) : null;
									}}
									className="filmdetail__button filmdetail__button-delete"
									type="button"
								>
									Eliminar
								</button>
							</>
						) : (
							""
						)}
						<button
							onClick={() => onVisibilidadDetallePelicula(false)}
							className="filmdetail__button filmdetail__button-cancel"
							type="button"
						>
							Cerrar
						</button>
					</div>
				</section>
			</div>
		</>
	);
};

export default PeliculaDetalle;
