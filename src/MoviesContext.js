import { createContext, useContext, useReducer } from 'react';

// Creamos los contextos para películas y el dispatch que permitirá hacer cambios en el estado
const MoviesContext = createContext(null);
const MoviesDispatchContext = createContext(null);

// Proveedor del contexto que envuelve a la aplicación y distribuye las películas y dispatch a los hijos
export function MoviesProvider({ children }) {
  const [state, dispatch] = useReducer(moviesReducer, initialState);

  return (
    // Proveemos el estado y el dispatch a los componentes hijos
    <MoviesContext.Provider value={state}>
      <MoviesDispatchContext.Provider value={dispatch}>
        {children}
      </MoviesDispatchContext.Provider>
    </MoviesContext.Provider>
  );
}

// Funciones para usar las películas y dispatch en los componentes
export function useMovies() {
  return useContext(MoviesContext).movies;
}

export function useWatchedMovies() {
  return useContext(MoviesContext).watched;
}

export function useMoviesDispatch() {
  return useContext(MoviesDispatchContext);
}

// Reducer que define cómo cambiar el estado de las películas según las acciones
function moviesReducer(state, action) {
  switch (action.type) {
    // Acción para agregar una película nueva
    case 'added': {
      return {
        ...state,
        movies: [...state.movies, {
          id: action.id,
          text: action.text,
          done: false // La película no ha sido vista
        }]
      };
    }
    
    // Acción para modificar el nombre o el estado (visto/no visto) de una película
    case 'changed': {
      return {
        ...state,
        movies: state.movies.map(m => {
          if (m.id === action.movie.id) {
            return action.movie; // Se actualiza la película correspondiente
          } else {
            return m;
          }
        })
      };
    }
    
    // Acción para eliminar una película
    case 'deleted': {
      return {
        ...state,
        movies: state.movies.filter(m => m.id !== action.id)
      };
    }

    // Acción para mover una película a la lista de vistas
    case 'moveToWatched': {
      const movie = state.movies.find(m => m.id === action.id);
      return {
        movies: state.movies.filter(m => m.id !== action.id), // Eliminar de la lista activa
        watched: [movie, ...state.watched] // Agregar a la lista de vistas (al principio)
      };
    }

    // Acción para cambiar el orden de las películas
    case 'reorder': {
      const { movieId, newRank } = action;
      const movieIndex = state.movies.findIndex(m => m.id === movieId);
      if (movieIndex === -1 || newRank < 1 || newRank > state.movies.length) return state; // Validamos el rango

      const updatedMovies = [...state.movies];
      const [movedMovie] = updatedMovies.splice(movieIndex, 1); // Quitamos la película
      updatedMovies.splice(newRank - 1, 0, movedMovie); // Insertamos en la nueva posición

      return {
        ...state,
        movies: updatedMovies
      };
    }

    // Si llega una acción desconocida, lanzamos un error
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

// Estado inicial con cinco películas en la lista
const initialState = {
  movies: [
    { id: 0, text: 'Inception', done: false },
    { id: 1, text: 'Interstellar', done: false },
    { id: 2, text: 'Matrix', done: false },
    { id: 3, text: 'Lord of the Rings', done: false },
    { id: 4, text: 'Avatar', done: false }
  ],
  watched: [] // Lista vacía de películas vistas
};
