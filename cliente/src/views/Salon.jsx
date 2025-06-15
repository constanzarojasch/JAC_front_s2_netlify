import '../assets/styles/salon.css';
import CameraImg from '../assets/img/camera.png';
import PopcornImg from '../assets/img/popcorn.png';

export default function Salon() {
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
              <tr>
                <td>1</td>
                <td>player19823</td>
                <td>2&nbsp;156&nbsp;670</td>
              </tr>
              <tr>
                <td>2</td>
                <td>conireds</td>
                <td>1&nbsp;802&nbsp;800</td>
              </tr>
              <tr>
                <td>3</td>
                <td>javidon99</td>
                <td>1&nbsp;578&nbsp;430</td>
              </tr>
              <tr>
                <td>4</td>
                <td>fabulosanto</td>
                <td>1&nbsp;002&nbsp;990</td>
              </tr>
              <tr>
                <td>5</td>
                <td>mariacine</td>
                <td>987&nbsp;450</td>
              </tr>
              <tr>
                <td>6</td>
                <td>cinemaster</td>
                <td>876&nbsp;320</td>
              </tr>
              <tr>
                <td>7</td>
                <td>starplayer</td>
                <td>765&nbsp;210</td>
              </tr>
              <tr>
                <td>8</td>
                <td>hollywoodfan</td>
                <td>654&nbsp;890</td>
              </tr>
              <tr>
                <td>9</td>
                <td>cinefilo2023</td>
                <td>543&nbsp;670</td>
              </tr>
              <tr>
                <td>10</td>
                <td>peliculero</td>
                <td>432&nbsp;500</td>
              </tr>
              <tr>
                <td>11</td>
                <td>actrizestrella</td>
                <td>321&nbsp;340</td>
              </tr>
              <tr>
                <td>12</td>
                <td>directorlegendario</td>
                <td>210&nbsp;180</td>
              </tr>
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
