
const Pelicula = ({pelicula}) => {
    return (
        <div>
            <p>{pelicula.title}</p>
            <p>{pelicula.year}</p>
            <p>{pelicula.synopsis}</p>
            <p>{pelicula.director}</p>
            <p>{pelicula.category}</p>
        </div>
    )
}

export default Pelicula
