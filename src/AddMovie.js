import { useState } from 'react';
import { useMoviesDispatch } from './MoviesContext.js';

export default function AddMovie() {
  const [text, setText] = useState('');
  const dispatch = useMoviesDispatch();

  return (
    <>
      <input
        placeholder="Agregar película"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={() => {
          // Verificar si el campo de texto está vacío antes de agregar la película
          if (text.trim() !== '') {
            dispatch({
              type: 'added',
              id: nextId++,
              text: text
            });
            setText(''); // Limpiar el campo de texto después de agregar la película
          }
        }}
      >
        Agregar
      </button>
    </>
  );
}

let nextId = 5;
