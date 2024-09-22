import React from 'react';
import AddMovie from './AddMovie';
import MovieList from './MovieList';
import WatchedMovies from './WatchedMovies';
import { MoviesProvider } from './MoviesContext';

function App() {
  return (
    <MoviesProvider>
      <h1>Ranking de Películas</h1>
      <AddMovie />
      <MovieList />
      <h2>Películas Vistas</h2>
      <WatchedMovies />
    </MoviesProvider>
  );
}

export default App;
