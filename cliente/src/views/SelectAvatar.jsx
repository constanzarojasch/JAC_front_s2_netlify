import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import avatarMap from '../assets/avatars';
import '../assets/styles/selectAvatar.css';

export default function SelectAvatar({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [names, setNames] = useState([]);
  const [taken, setTaken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      API.get('/avatar'),
      API.get(`/players/game/${id}`),
    ])
      .then(([{ data: avatars }, { data: players }]) => {
        setNames(avatars.map((avatar) => avatar.name));
        setTaken(players.map((player) => player.Avatar.name));
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChooseAvatar = async (name) => {
    try {
      const gameId = Number(id);
      await API.post('/player', {
        username: user.username,
        avatarName: name,
        gameId,
      });

      const res = await API.get(`/game/${gameId}`);
      const updatedGame = res.data;

      if (updatedGame.state === 'activa') {
        navigate(`/game/${gameId}`);
      } else {
        navigate(`/waiting/${gameId}`);
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleAvatarClick = (name, isDisabled) => {
    if (!isDisabled) {
      handleChooseAvatar(name);
    }
  };

  if (loading) return <p>Cargando avatares…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="select-avatar-page">
      <h1>ESCOGE TU AVATAR</h1>
      <div className="avatars-grid">
        {names.map((name) => {
          const isDisabled = taken.includes(name);
          return (
            <div
              key={name}
              className={`avatar-cell ${isDisabled ? 'taken' : ''}`}
              onClick={() => handleAvatarClick(name, isDisabled)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAvatarClick(name, isDisabled);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <img src={avatarMap[name.replace(/ /g, '_')]} alt={name} />
              {isDisabled && <div className="overlay">No disponible</div>}
            </div>
          );
        })}
      </div>
    </main>
  );
}
