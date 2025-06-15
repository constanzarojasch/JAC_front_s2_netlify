/* eslint-disable no-shadow */

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Board from '../components/Board';
import TurnInfo from '../components/TurnInfo';
import DicePanel from '../components/DicePanel';
import LeaveButton from '../components/LeaveButton';
import '../assets/styles/game-view.css';

export default function GameView({ user }) {
  const { id: gameId } = useParams();
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
  const username = user?.username;

  const fetchGame = useCallback(async () => {
    try {
      const res = await API.get(`/game/${gameId}`);
      setGameData(res.data);
      if (res.data.lastCard && res.data.lastCardDrawer !== username) {
        setOtherCard(res.data.lastCard);
        if (!showOtherCard) {
          setShowOtherCard(true);
        }
      } else {
        setOtherCard(null);
        setShowOtherCard(false);
      }
    } catch (err) {
      setError('No se pudo cargar la partida');
    }
  }, [gameId, username, showOtherCard]);

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
    if (!isMyTurn || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [isMyTurn, timeLeft]);
  useEffect(() => {
    if (!showOtherCard) return;
    if (otherCardTimeoutRef.current) {
      clearTimeout(otherCardTimeoutRef.current);
    }

    otherCardTimeoutRef.current = setTimeout(() => {
      setShowOtherCard(false);
      API.post(`/game/${gameId}/clearLastCard`).catch((err) => {
        console.error('Error clearing last card:', err);
      });
    }, 5000);

    return () => {
      if (otherCardTimeoutRef.current) {
        clearTimeout(otherCardTimeoutRef.current);
      }
    };
  }, [showOtherCard, gameId]);

  if (error) return <p>{error}</p>;
  if (!gameData) return <p>Cargando partida...</p>;

  return (
    <main className="game-container">
      <div className="game-left-panel">
        <TurnInfo username={gameData.currentPlayerUsername} timeLeft={timeLeft} />
        <LeaveButton />
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
        <div className="spotlight-overlay">
          <div className="spotlight-card">
            <h2>SPOTLIGHT</h2>
            <p>{pendingCard.description}</p>
            <button
              className="btn"
              onClick={() => {
                setPendingCard(null);
                setCardRevealed(false);
                setDiceResult(null);
                setFakePositions({});
                fetchGame();
              }}
            >
              Aplicar efecto
            </button>
          </div>
        </div>
      )}
      {showOtherCard && otherCard && (
        <div className="spotlight-overlay">
          <div className="spotlight-card">
            <h2>SPOTLIGHT</h2>
            <p>{otherCard.descriptionOthers}</p>
            <button
              className="btn"
              onClick={async () => {
                setShowOtherCard(false);
                await API.post(`/game/${gameId}/clearLastCard`);
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
