import React from 'react';
import '../assets/styles/game-view.css';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirmar acción',
  message = '¿Estás seguro?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="spotlight-overlay">
      <div className="spotlight-card">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-buttons">
          <button className="btn confirm-btn" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="btn cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
