import '../assets/styles/instructions.css';
import CinemaImg from '../assets/img/cinema.png';

export default function Instrucciones() {
  return (
    <main className="content">
      <h1>INSTRUCCIONES</h1>
      <div className="instructions-container">
        <ol>
          <li>Selecciona tu avatar dentro de los disponibles.</li>
          <li>Cuando se unan todos los jugadores, comenzará el juego.</li>
          <li>Espera a tu turno y selecciona “Tirar dados”.</li>
          <li>Tu avatar avanzará la cantidad de lugares que indique el dado.</li>
          <li>
            Si caes en una casilla
            <strong>SPOTLIGHT</strong>
            , debes robar una carta de fortuna.
          </li>
          <li>Luego, será el turno del siguiente jugador.</li>
          <li>¡El primero en llegar a la casilla de la fama gana el juego!</li>
        </ol>
        <img
          src={CinemaImg}
          alt="Claqueta cinematográfica"
          className="instructions-img"
        />
      </div>
    </main>
  );
}
