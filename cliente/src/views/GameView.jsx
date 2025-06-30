/* eslint-disable no-shadow */

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { fetchGamePodium, leaveGame, pasarTurno } from '../api';
import Board from '../components/Board';
import TurnInfo from '../components/TurnInfo';
import DicePanel from '../components/DicePanel';
import LeaveButton from '../components/LeaveButton';
import SpotlightCard from '../components/SpotlightCard';
import OtherPlayerCard from '../components/OtherPlayerCard';
import ConfirmDialog from '../components/ConfirmDialog';
import '../assets/styles/game-view.css';

export default function GameView({ user }) {
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [pendingCard, setPendingCard] = useState(null);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [otherCard, setOtherCard] = useState(null);
  const [showOtherCard, setShowOtherCard] = useState(false);
  const otherCardTimeoutRef = useRef(null);
  const [fakePositions, setFakePositions] = useState({});
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameFinished, setGameFinished] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const username = user?.username;

  const fetchGame = useCallback(async () => {
    try {
      const res = await API.get(`/game/${gameId}`);
      setGameData(res.data);

      if (res.data.state === 'finalizada' || res.data.state === 'finished' || res.data.winner) {
        setGameFinished(true);
      }

      if (res.data.lastCard && res.data.lastCardDrawer !== username) {
        setOtherCard(res.data.lastCard);
        setShowOtherCard(true);
      } else {
        setOtherCard(null);
      }
    } catch (err) {
      setError('No se pudo cargar la partida');
    }
  }, [gameId, username, navigate]);
  const hasNavigatedRef = useRef(false);
  useEffect(() => {
    if (hasNavigatedRef.current) return;

    if (!gameData) return;

    const s = gameData.state;
    const ended = s === 'finalizada' || s === 'finished';
    const winner = gameData.players?.find((player) => player.boardPosition >= 100);

    if ((ended && isLeaving) || (ended && !winner)) {
      hasNavigatedRef.current = true;
      fetchGamePodium(gameId)
        .then((resp) => {
          const podium = Array.isArray(resp.data.podio) ? resp.data.podio : [];
          navigate(`/podium/${gameId}`, {
            state: {
              podium,
              gameEndReason: ended && !winner && !isLeaving ? 'abandon' : 'normal',
            },
          });
        })
        .catch(() => {
          navigate(`/podium/${gameId}`, {
            state: {
              podium: [],
              gameEndReason: ended && !winner && !isLeaving ? 'abandon' : 'normal',
            },
          });
        });
    }
  }, [gameData, gameId, isLeaving, navigate]);
  useEffect(() => {
    fetchGame();
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [fetchGame]);

  useEffect(() => {
    if (!gameData) return;
    setTimeLeft(20);
  }, [gameData?.currentPlayerUsername]);

  const isMyTurn = gameData?.currentPlayerUsername === username;

  useEffect(() => {
    if (!isMyTurn) return;

    if (timeLeft <= 0) {
      const handleTimeOut = async () => {
        try {
          await pasarTurno(gameId, username);
          fetchGame();
        } catch (error) {
          fetchGame();
        }
      };

      handleTimeOut();
      return;
    }

    const t = setTimeout(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    return () => clearTimeout(t);
  }, [isMyTurn, timeLeft, gameId, username, fetchGame]);

  useEffect(() => {
    if (!showOtherCard) return;
    if (otherCardTimeoutRef.current) {
      clearTimeout(otherCardTimeoutRef.current);
    }

    otherCardTimeoutRef.current = setTimeout(() => {
      setShowOtherCard(false);
      API.post(`/game/${gameId}/clearLastCard`);
    }, 5000);

    return () => {
      if (otherCardTimeoutRef.current) {
        clearTimeout(otherCardTimeoutRef.current);
      }
    };
  }, [showOtherCard, gameId]);
  const handleLeave = useCallback(() => {
    setShowConfirmLeave(true);
  }, []);

  const confirmLeave = useCallback(async () => {
    if (!gameId || !username) {
      setShowConfirmLeave(false);
      return;
    }

    setIsLeaving(true);
    setShowConfirmLeave(false);

    try {
      const response = await leaveGame({ gameId, username });
      setGameData((prev) => ({ ...prev, state: 'finalizada' }));
      navigate(`/podium/${gameId}`, {
        state: { podium: response.podium || [] },
      });
    } catch (err) {
      navigate(`/podium/${gameId}`, { state: { podium: [] } });
    } finally {
      setIsLeaving(false);
    }
  }, [gameId, username, navigate]);

  const cancelLeave = useCallback(() => {
    setShowConfirmLeave(false);
  }, []);

  const checkForWinner = useCallback(async () => {
    if (!gameData?.players) return null;

    const winner = gameData.players.find((player) => player.boardPosition >= 100);

    if (winner && !gameFinished) {
      setGameFinished(true);

      try {
        const podiumResponse = await fetchGamePodium(gameId);

        setTimeout(() => {
          navigate(`/podium/${gameId}`, {
            state: {
              podio: podiumResponse.data.podio,
              gameEndReason: 'winner',
            },
          });
        }, 3000);
      } catch (error) {
        setTimeout(() => {
          navigate(`/podium/${gameId}`, {
            state: {
              gameEndReason: 'winner',
              podio: gameData.players
                .sort((a, b) => b.boardPosition - a.boardPosition)
                .map((player, index) => ({
                  username: player.username,
                  avatarName: player.avatarName,
                  position: index + 1,
                  score: 0,
                })),
            },
          });
        }, 3000);
      }
    }

    return winner;
  }, [gameData?.players, gameFinished, navigate, gameId]);

  useEffect(() => {
    if (gameData && !gameFinished) {
      checkForWinner();
    }
  }, [gameData, checkForWinner, gameFinished]);

  if (error) return <p>{error}</p>;
  if (!gameData) return <p>Cargando partida...</p>;

  if (gameFinished || gameData?.state === 'finalizada' || gameData?.state === 'finished') {
    return (
      <div className="game-finished-overlay">
        <div className="game-finished-message">
          <h1>El juego ha finalizado</h1>
          <button
            className="btn"
            onClick={async () => {
              try {
                const response = await fetchGamePodium(gameId);
                navigate(`/podium/${gameId}`, {
                  state: {
                    podio: response.data,
                    gameEndReason: 'winner',
                  },
                });
              } catch (error) {
                navigate(`/podium/${gameId}`, {
                  state: {
                    gameEndReason: 'winner',
                    podio: gameData.players
                      .sort((a, b) => b.boardPosition - a.boardPosition)
                      .map((player, index) => ({
                        username: player.username,
                        avatarName: player.avatarName,
                        position: index + 1,
                        score: player.boardPosition,
                      })),
                  },
                });
              }
            }}
          >
            Ir al Podio
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="game-container">
      <div className="game-left-panel">
        <TurnInfo
          username={gameData.currentPlayerUsername}
          timeLeft={timeLeft}
          isMyTurn={isMyTurn}
        />
        <LeaveButton
          onLeave={handleLeave}
          disabled={isLeaving}
        >
          {isLeaving ? 'Retirando…' : 'Retirarse del juego'}
        </LeaveButton>
      </div>

      <div className="game-main-panel">
        <Board
          spotlightPositions={gameData.spotlightBoxesId}
          players={gameData.players}
          overrides={fakePositions}
        />
      </div>

      <div className="game-right-panel">
        <DicePanel
          gameId={gameId}
          username={username}
          isMyTurn={isMyTurn}
          onRolled={fetchGame}
          onDiceResult={setDiceResult}
          onCard={setPendingCard}
          onFakePosition={(pos) => setFakePositions({ [username]: pos })}
        />

        {diceResult && (() => {
          let actionButton = null;
          if (pendingCard && !cardRevealed) {
            actionButton = (
              <button
                type="button"
                className="btn"
                onClick={() => setCardRevealed(true)}
              >
                Robar carta
              </button>
            );
          } else if (!pendingCard) {
            actionButton = (
              <button
                type="button"
                className="btn"
                onClick={() => setDiceResult(null)}
              >
                Terminar turno
              </button>
            );
          }
          return (
            <div className="dice-result-display">
              <p>
                🎲
                {diceResult.dado1}
                +
                {diceResult.dado2}
                =
                {diceResult.total}
              </p>
              {actionButton}
            </div>
          );
        })()}
      </div>

      {pendingCard && cardRevealed && (
        <SpotlightCard
          card={pendingCard}
          onApplyEffect={() => {
            setPendingCard(null);
            setCardRevealed(false);
            setDiceResult(null);
            setFakePositions({});
            fetchGame();
          }}
        />
      )}

      {showOtherCard && otherCard && (
        <OtherPlayerCard
          card={otherCard}
          playerName={gameData.lastCardDrawer}
          onClose={async () => {
            setShowOtherCard(false);
            await API.post(`/game/${gameId}/clearLastCard`);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmLeave}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
        message="¿Estás seguro de que quieres abandonar el juego?"
        title="Confirmar abandono"
      />
    </main>
  );
}
