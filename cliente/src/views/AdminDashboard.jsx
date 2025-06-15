import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import '../assets/styles/game.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [filterUsers, setFilterUsers] = useState('');
  const [filterGames, setFilterGames] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usersRes = await API.get('/admin/users');
      setUsers(usersRes.data);
      const gamesRes = await API.get('/games');
      setGames(gamesRes.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm(`¿Eliminar usuario ${id}?`)) return;
    await API.delete(`/admin/users/${id}`);
    setUsers((u) => u.filter((x) => x.id !== id));
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm(`¿Eliminar partida ${id}?`)) return;
    await API.delete(`/admin/games/${id}`);
    setGames((g) => g.filter((x) => x.id !== id));
  };

  if (loading) return <p className="status">Cargando datos administrativos…</p>;
  if (error) {
    return (
      <p className="status error">
        Error:
        {error}
      </p>
    );
  }

  // filtrados
  const filteredUsers = users
    .filter(({ username }) => username.toLowerCase()
      .includes(filterUsers.toLowerCase()));

  const filteredGames = games
    .filter(({ name }) => name.toLowerCase()
      .includes(filterGames.toLowerCase()));

  return (
    <main className="game-page">
      {/* Título principal */}
      <div>
        <h1>PANEL DE ADMINISTRACIÓN</h1>
      </div>

      {/* Sección Usuarios */}
      <section>
        <div className="game-header">
          <h1>Usuarios</h1>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar usuario…"
            value={filterUsers}
            onChange={(e) => setFilterUsers(e.target.value)}
          />
        </div>
        {filteredUsers.length === 0 ? (
          <p className="status">No hay usuarios que coincidan.</p>
        ) : (
          <div className="game-grid">
            {filteredUsers.map((u) => (
              <div key={u.id} className="game-card">
                <h2 className="card-title">{u.username}</h2>
                <p className="card-sub">{u.isAdmin ? 'Administrador' : 'Usuario'}</p>
                <button className="join-btn" onClick={() => handleDeleteUser(u.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div className="game-header">
          <h1>Partidas</h1>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar partida…"
            value={filterGames}
            onChange={(e) => setFilterGames(e.target.value)}
          />
        </div>
        {filteredGames.length === 0 ? (
          <p className="status">No hay partidas que coincidan.</p>
        ) : (
          <div className="game-grid">
            {filteredGames.map((g) => (
              <div key={g.id} className="game-card">
                <h2 className="card-title">{g.name}</h2>
                <p className="card-sub">
                  Estado:
                  {g.state}
                </p>
                <button className="join-btn" onClick={() => handleDeleteGame(g.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
