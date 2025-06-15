import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/styles/waiting.css';

export default function WaitingRoom({ user }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  const fetchGame = useCallback(async () => {
    try {
      const res = await API.get(`/game/${id}`);
      setGame(res.data);
    } catch (err) {
      setError('No se pudo cargar la partida.');
      nav('/game');
    }
  }, [id]);

  useEffect(() => {
    fetchGame();
    const interval = setInterval(fetchGame, 5000);
    return () => { clearInterval(interval); };
  }, [fetchGame]);

  useEffect(() => {
    if (game?.state === 'activa') {
      nav(`/game/${game.id}`);
    }
  }, [game, nav]);

  if (error) { return <p className="waiting-error">{error}</p>; }
  if (!game) { return <p className="waiting-loading">Cargando…</p>; }

  const handleCancel = () => {
    if (user?.username !== game.creatorUsername) {
      API.delete(`/player/${user.username}/game/${id}`)
        .then(() => nav('/game'))
        .catch((err) => alert(err.response?.data?.error || err.message));
      return;
    }
    API.delete(`/game/${id}`)
      .then(() => nav('/game'))
      .catch((err) => alert(err.response?.data?.error || err.message));
    nav('/game');
  };

  return (
    <main className="waiting-container">
      <h1 className="waiting-title">Esperando que se unan jugadores…</h1>
      <div className="waiting-count">
        {game.playersId.length}
        {' '}
        /
        {game.maxPlayers}
      </div>
      <button className="btn cancel-btn" onClick={handleCancel}>
        Cancelar
      </button>
    </main>
  );
}
