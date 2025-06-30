import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { fetchGamePodium } from '../api';
import avatars from '../assets/avatars';
import '../assets/styles/podium.css';

export default function Podium() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: gameId } = useParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determinar el título basado en cómo terminó el juego
  const getTitle = () => {
    const reason = location.state?.gameEndReason;
    switch (reason) {
      case 'abandon':
        return 'Juego terminado - Un jugador abandonó';
      case 'winner':
        return '¡Tenemos un ganador!';
      default:
        return '¡Juego terminado!';
    }
  };

  const defaultResults = [
    {
      username: 'Jugador1',
      avatarName: 'Taylor_Swift',
      position: 1,
      score: 100,
    },
    {
      username: 'Jugador2',
      avatarName: 'Harry_Styles',
      position: 2,
      score: 85,
    },
    {
      username: 'Jugador3',
      avatarName: 'Ariana_Grande',
      position: 3,
      score: 70,
    },
  ];

  useEffect(() => {
    const loadPodiumData = async () => {
      const gameResults = location.state?.gameResults || location.state?.podio;

      if (gameResults && gameResults.length > 0) {
        setResults(gameResults);
        return;
      }

      if (gameId) {
        setLoading(true);
        setError(null);

        try {
          const response = await fetchGamePodium(gameId);

          if (response.podio && response.podio.length > 0) {
            const flattenedResults = [];
            let currentPosition = 1;

            response.podio.forEach((grupo) => {
              grupo.forEach((player) => {
                flattenedResults.push({
                  username: player.username,
                  avatarName: player.avatarName,
                  position: currentPosition,
                  score: player.score || 0,
                });
              });
              currentPosition += grupo.length;
            });

            setResults(flattenedResults);
          } else {
            setResults(defaultResults);
          }
        } catch (err) {
          setError('Error al cargar los resultados del podio');
          setResults(defaultResults);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(defaultResults);
      }
    };

    loadPodiumData();
  }, [location.state, gameId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const sortedResults = [...results].sort((a, b) => a.position - b.position);

  const handleNewGame = () => {
    navigate('/game');
  };

  const handleHome = () => {
    navigate('/');
  };

  const renderConfetti = () => {
    if (!showConfetti) return null;

    const pieces = [];
    for (let i = 0; i < 50; i += 1) {
      pieces.push(
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />,
      );
    }
    return <div className="confetti">{pieces}</div>;
  };

  const renderPodiumStep = (player) => {
    let positionClass;
    if (player.position === 1) positionClass = 'first';
    else if (player.position === 2) positionClass = 'second';
    else positionClass = 'third';

    const avatarKey = player.avatarName?.replace(/ /g, '_');
    const avatar = avatars[avatarKey] || avatars.Taylor_Swift;

    return (
      <div key={player.username} className={`podium-step ${positionClass} celebration-animation`}>
        <div className="podium-player">
          {player.position === 1 && <div className="podium-crown">👑</div>}
          <img
            src={avatar}
            alt={player.username}
            className="podium-avatar"
          />
          <div className="podium-position">{player.position}</div>
        </div>
        <div className="podium-base">
          <div className="podium-username">{player.username}</div>
          <div className="podium-score">
            {player.score}
            {' pts'}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="podium-container">
        <h1 className="podium-title">Cargando resultados...</h1>
      </div>
    );
  }

  return (
    <div className="podium-container">
      {renderConfetti()}

      <h1 className="podium-title">{getTitle()}</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="podium-content">
        {sortedResults.slice(0, 3).map((player) => (
          renderPodiumStep(player)
        ))}
      </div>

      {sortedResults.length > 3 && (
        <div className="other-players">
          <h3>Otros jugadores:</h3>
          {sortedResults.slice(3).map((player) => (
            <div key={player.username} className="other-player">
              <span>
                {player.position}
                º
                {player.username}
              </span>
              <span>
                {player.score}
                pts
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="podium-actions">
        <button className="podium-btn primary" onClick={handleNewGame}>
          Nueva Partida
        </button>
        <button className="podium-btn" onClick={handleHome}>
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}
