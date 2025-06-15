/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { login } from '../api';
import '../assets/styles/login.css';

export default function Login({ onLogin }) {
  const [u, setU] = useState(''); const [p, setP] = useState(''); const
    [e, setE] = useState('');
  const submit = async (e1) => {
    e1.preventDefault();
    try {
      const user = await login({ username: u, password: p });
      onLogin(user);
    } catch (err) {
      setE(err.response?.data?.error || err.message);
    }
  };
  return (
    <form className="login-form" onSubmit={submit}>
      <h1>Login</h1>
      <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Usuario" required />
      <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Contraseña" required />
      <button className="btn">Confirmar</button>
      {e && <p className="error">{e}</p>}
    </form>
  );
}
