/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/styles/game.css';

export default function Game({ user }) {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/games');
      const notFinished = res.data.filter((game) => game.state !== 'finalizada');
      setGames(notFinished);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const filtered = games.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()));

  const joinGame = (game) => {
    nav(`/game/${game.id}/avatar`);
  };

  if (loading) return <p className="status">Cargando partidas…</p>;
  if (error) {
    return (
      <p className="status error">
        Error:
        {error}
      </p>
    );
  }

  return (
    <main className="game-page">
      <div className="game-header">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar partida…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <h1>PARTIDAS ACTIVAS</h1>
        <button
          className="create-btn"
          onClick={() => nav('/game/create')}
        >
          Crear partida
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="status">No hay partidas que coincidan.</p>
      ) : (
        <div className="game-grid">
          {filtered.map((g) => (
            <div key={g.id} className="game-card">
              <h2 className="card-title">{g.name}</h2>
              <p className="card-sub">
                Jugadores:
                {' '}
                {g.playersId.length}
                /
                {g.maxPlayers}
              </p>

              {g.state === 'esperando' ? (
                <button
                  className="join-btn"
                  onClick={() => joinGame(g)}
                >
                  Unirse
                </button>
              ) : (
                <span className="badge in-game">En juego</span>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
