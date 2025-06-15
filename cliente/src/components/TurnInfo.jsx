export default function TurnInfo({ username = 'Jugador', timeLeft = 20 }) {
  return (
    <div className="turn-info">
      <p>Turno de:</p>
      <strong>{username}</strong>
      <p>
        Tiempo restante:
        {timeLeft}
        s
      </p>
    </div>
  );
}
