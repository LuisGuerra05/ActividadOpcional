import { useState, useEffect } from 'react';
import { useMovies, useMoviesDispatch } from './MoviesContext.js';

// Componente que muestra la lista de películas
export default function MovieList() {
  const [isEditingRanking, setIsEditingRanking] = useState(false); // Controla si estamos editando el ranking
  const movies = useMovies(); // Obtenemos las películas del contexto

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {/* Botón para habilitar/deshabilitar el modo de edición del ranking */}
        <button onClick={() => setIsEditingRanking(!isEditingRanking)}>
          {isEditingRanking ? 'Finalizar edición de ranking' : 'Editar ranking'}
        </button>
      </div>

      <ul>
        {/* Mapear la lista de películas y mostrar cada una con un componente Movie */}
        {movies.map((movie, index) => (
          <li key={movie.id}>
            <Movie movie={movie} rank={index + 1} isEditingRanking={isEditingRanking} totalMovies={movies.length} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Componente individual para cada película
function Movie({ movie, rank, isEditingRanking, totalMovies }) {
  const [isEditing, setIsEditing] = useState(false); // Estado local para controlar si estamos editando
  const [newRank, setNewRank] = useState(rank); // Estado para el nuevo ranking
  const dispatch = useMoviesDispatch(); // Obtenemos el dispatch del contexto

  // Sincronizamos el estado del ranking cuando el componente reciba nuevos props (nuevo ranking)
  useEffect(() => {
    setNewRank(rank);
  }, [rank]);

  let movieContent;

  // Si estamos editando el nombre, mostramos un input para cambiarlo
  if (isEditing) {
    movieContent = (
      <>
        <input
          value={movie.text}
          onChange={e => {
            dispatch({
              type: 'changed',  // Acción de cambio
              movie: {
                ...movie,
                text: e.target.value // Actualizamos el nombre de la película
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
          Guardar
        </button>
      </>
    );
  } else {
    // Si no estamos editando, mostramos el número antes del nombre de la película
    movieContent = (
      <>
        {!isEditingRanking && <span>{rank}. </span>} {/* Mostramos el número antes del título */}
        {movie.text}
      </>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Checkbox para marcar la película como vista */}
      <input
        type="checkbox"
        checked={movie.done}
        onChange={(e) => {
          e.stopPropagation(); // Aseguramos que solo el clic en el checkbox lo active
          if (!movie.done) { // Solo marcamos como vista si aún no está marcada
            dispatch({
              type: 'changed',
              movie: {
                ...movie,
                done: true
              }
            });

            setTimeout(() => {
              dispatch({
                type: 'moveToWatched',
                id: movie.id
              });
            }, 500);
          }
        }}
      />

      {movieContent}

      {/* Input para cambiar la posición en el ranking, solo visible en modo edición de ranking */}
      {isEditingRanking ? (
        <input
          type="number"
          value={newRank}
          min="1"
          max={totalMovies}  // El valor máximo es dinámico basado en la cantidad total de películas
          onChange={e => setNewRank(Number(e.target.value))}
          onBlur={() => {
            if (newRank !== rank) {
              dispatch({
                type: 'reorder',  // Acción para reordenar
                movieId: movie.id,
                newRank: newRank
              });
            }
          }}
          style={{ marginLeft: '10px' }}
        />
      ) : null}

      {/* Botones para editar y eliminar, mostrados juntos y separados del título */}
      {!isEditingRanking && !isEditing && ( // Solo mostrar el botón de editar si no estamos editando
        <div style={{ marginLeft: '10px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{ marginRight: '2px' }}
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Evitamos que el clic en el botón active el checkbox
              dispatch({
                type: 'deleted', // Acción de eliminar
                id: movie.id
              });
            }}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
