export default function TurnInfo({ username = 'Jugador', timeLeft = 20, isMyTurn = false }) {
  return (
    <div className="turn-info">
      <p>
        Turno de:
        {' '}
      </p>
      <strong>{username}</strong>
      {isMyTurn && (
        <p>
          Tiempo restante:
          {timeLeft}
          s
        </p>
      )}
    </div>
  );
}
