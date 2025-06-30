import { useState, useEffect } from 'react';
import {
  Routes, Route, Navigate, useNavigate, useLocation,
} from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/Home';
import Instrucciones from './views/Instrucciones';
import Salon from './views/Salon';
import AdminDashboard from './views/AdminDashboard';
import './App.css';

import Login from './views/Login';
import SignUp from './views/SignUp';
import Game from './views/Game';
import CreateGame from './views/CreateGame';
import Nosotros from './views/Nosotros';
import WaitingRoom from './views/WaitingRoom';
import SelectAvatar from './views/SelectAvatar';
import GameView from './views/GameView';
import Podium from './views/Podium';
import { getCurrentUser, logout } from './api';

function Protected({ children }) {
  return getCurrentUser() ? children : <Navigate to="/login" replace />;
}
export default function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);
  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  const handleLogin = (u) => { setUser(u); nav('/game'); };
  const handleLogout = () => { logout(); setUser(null); nav('/'); };

  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instrucciones" element={<Instrucciones />} />
        <Route path="/salon" element={<Salon />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp onSignUp={() => nav('/login')} />} />
        <Route
          path="/game"
          element={
            <Protected><Game user={user} /></Protected>
        }
        />

        <Route path="/game/:id" element={<Protected><GameView user={user} /></Protected>} />
        <Route path="/podium" element={<Protected><Podium /></Protected>} />
        <Route path="/podium/:id" element={<Protected><Podium /></Protected>} />
        <Route
          path="/admin"
          element={
            user?.admin
              ? <AdminDashboard />
              : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<h1>404 Not Found</h1>} />

        <Route path="/game/create" element={<CreateGame user={user} />} />
        <Route path="/game/:id/avatar" element={<SelectAvatar user={user} />} />
        <Route path="/game/:id" element={<WaitingRoom user={user} />} />
        <Route path="/waiting/:id" element={<WaitingRoom user={user} />} />

      </Routes>
    </>
  );
}
