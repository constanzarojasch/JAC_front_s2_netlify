import React from 'react';
import '../assets/styles/game-view.css';

export default function OtherPlayerCard({
  card,
  playerName,
  onClose,
}) {
  if (!card) return null;

  return (
    <div className="spotlight-overlay">
      <div className="spotlight-card">
        <h2>SPOTLIGHT</h2>
        <p>
          {playerName}
          {' '}
          {card.descriptionOthers}
        </p>
        <button className="btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
