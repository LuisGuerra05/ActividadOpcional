import { useWatchedMovies } from './MoviesContext.js';

// Componente que muestra las películas vistas
export default function WatchedMovies() {
  const watchedMovies = useWatchedMovies(); // Obtenemos las películas vistas del contexto

  return (
    <ul>
      {/* Mapear la lista de películas vistas y mostrar cada una */}
      {watchedMovies.map(movie => (
        <li key={movie.id}>
          {movie.text}
        </li>
      ))}
    </ul>
  );
}
