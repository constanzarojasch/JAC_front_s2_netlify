import React from 'react';
import API from '../api';
import '../assets/styles/game-view.css';

export default function DicePanel({
  gameId,
  username,
  isMyTurn,
  onRolled,
  onDiceResult,
  onCard,
  onFakePosition,
}) {
  const handleRoll = async () => {
    try {
      const res = await API.post(`/game/${gameId}/lanzarDados`, { username });
      const result = res.data;

      if (onDiceResult) {
        onDiceResult(result);
      }

      if (result.carta) {
        if (onCard) { onCard(result.carta); }
        const posicionIntermedia = result.nuevoBoxId - result.carta.effect;
        if (onFakePosition) {
          onFakePosition(posicionIntermedia);
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error al lanzar los dados');
    } finally {
      if (onRolled) {
        onRolled();
      }
    }
  };

  return (
    <div className="dice-panel">
      {isMyTurn ? (
        <button className="btn" onClick={handleRoll}>
          Lanzar Dados
        </button>
      ) : (
        <p>Esperando turno...</p>
      )}
    </div>
  );
}
