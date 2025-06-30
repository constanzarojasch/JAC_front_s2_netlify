import { useEffect, useState } from 'react';
import '../assets/styles/salon.css';
import CameraImg from '../assets/img/camera.png';
import PopcornImg from '../assets/img/popcorn.png';
import { fetchHallOfFame } from '../api';

export default function Salon() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchHallOfFame()
      .then((data) => setPlayers(data))
      .catch((err) => {
        console.error('Error al cargar el salón de la fama:', err);
        setPlayers([]);
      });
  }, []);

  return (
    <main className="salon-container">
      <h1>SALÓN DE LA FAMA</h1>
      <div className="salon-content">
        <img
          src={CameraImg}
          alt="Cámara de cine"
          className="salon-icon left"
        />
        <div className="salon-table-wrapper">
          <table className="salon-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan="3">No hay jugadores aún.</td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr key={player.username}>
                    <td>{index + 1}</td>
                    <td>{player.username}</td>
                    <td>{player.score.toLocaleString('es-CL')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <img
          src={PopcornImg}
          alt="Palomitas de maíz"
          className="salon-icon right"
        />
      </div>
    </main>
  );
}
