/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { signUp } from '../api';
import '../assets/styles/login.css';

export default function SignUp({ onSignUp }) {
  const [u, setU] = useState(''); const [p, setP] = useState(''); const
    [e, setE] = useState('');
  const submit = async (e1) => {
    e1.preventDefault();
    try {
      await signUp({ username: u, password: p });
      onSignUp();
    } catch (err) {
      setE(err.response?.data?.error || err.message);
    }
  };
  return (
    <form className="login-form" onSubmit={submit}>
      <h1>Registro</h1>
      <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Usuario" required />
      <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Contraseña" required />
      <button className="btn">Crear cuenta</button>
      {e && <p style={{ color: 'red' }}>{e}</p>}
    </form>
  );
}
