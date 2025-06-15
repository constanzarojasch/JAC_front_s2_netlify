/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/styles/game.css';

export default function CreateGame({ user }) {
  const nav = useNavigate();
  const [gameName, setGameName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [avatars, setAvatars] = useState([]);
  const [avatarName, setAvatarName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/avatar')
      .then((res) => setAvatars(res.data))
      .catch(() => setError('No se pudo cargar avatars'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        username: user.username,
        gameName,
        maxPlayers,
        avatarName,
      };
      const res = await API.post('/game', payload);
      // redirige a la partida nueva o al listado
      nav(`/waiting/${res.data.idPartida}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <main className="create-game">
      <h1>CREAR PARTIDA</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            required
          />
        </label>

        <label>
          Número de jugadores:
          <select
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(+e.target.value)}
          >
            {[2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label>
          Avatar:
          <select
            value={avatarName}
            onChange={(e) => setAvatarName(e.target.value)}
            required
          >
            <option value="">--elige avatar--</option>
            {avatars.map((av) => (
              <option key={av.id} value={av.name}>{av.name}</option>
            ))}
          </select>
        </label>

        <button type="submit" className="create-btn">
          Crear
        </button>
      </form>
    </main>
  );
}
