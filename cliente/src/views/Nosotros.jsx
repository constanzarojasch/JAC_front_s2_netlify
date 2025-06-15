import React from 'react';
import '../assets/styles/nosotros.css';
import JavieraImg from '../assets/img/nosotros/javiera.jpg';
import AntoniaImg from '../assets/img/nosotros/antonia.jpg';
import ConstanzaImg from '../assets/img/nosotros/constanza.png';

export default function Nosotros() {
  return (
    <main className="nosotros-container">
      <h1>NOSOTRAS</h1>
      <p className="nosotros-intro">
        Somos un equipo de estudiantes de Ingeniería UC desarrollando el juego “Fame Race”.
      </p>
      <div className="nosotras-equipo">
        <div className="nosotras-col">
          <img src={AntoniaImg} alt="Antonia" />
          <h3>Antonia Pineda</h3>
          <p>21 años</p>
        </div>
        <div className="nosotras-col">
          <img src={ConstanzaImg} alt="Constanza" />
          <h3>Constanza Rojas</h3>
          <p>21 años</p>
        </div>
        <div className="nosotras-col">
          <img src={JavieraImg} alt="Javiera" />
          <h3>Javiera Donoso</h3>
          <p>21 años</p>
        </div>
      </div>
    </main>
  );
}
