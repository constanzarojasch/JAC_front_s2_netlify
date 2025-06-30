import React from 'react';
import '../assets/styles/game-view.css';

export default function SpotlightCard({
  card,
  onApplyEffect,
  buttonText = 'Aplicar efecto',
}) {
  if (!card) return null;

  return (
    <div className="spotlight-overlay">
      <div className="spotlight-card">
        <h2>SPOTLIGHT</h2>
        <p>{card.description}</p>
        <button className="btn" onClick={onApplyEffect}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
