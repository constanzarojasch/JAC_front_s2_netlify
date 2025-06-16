import { NavLink } from 'react-router-dom';

export default function NavBar({ user, onLogout }) {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <div className="navbar-left">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/instrucciones">Instrucciones</NavLink>
          <NavLink to="/salon">Salón de la fama</NavLink>
          <NavLink to="/nosotros">Nosotras</NavLink>
          <NavLink to="/game">Partidas</NavLink>
          {user?.admin && (
            <NavLink className="btn" to="/admin">Admin</NavLink>
          )}
        </div>
        <div className="navbar-right">
          {user ? (
            <>
              <span className="nav-greeting">
                Hola,
                {' '}
                {user.username}
              </span>
              <NavLink className="btn" to="/" onClick={onLogout}>Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink className="btn" to="/login">Iniciar Sesión</NavLink>
              <NavLink className="btn" to="/signup">Registrarse</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
