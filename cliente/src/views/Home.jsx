import '../assets/styles/style.css';
import logo from '../assets/img/fameLogo.png';

export default function Home() {
  return (
    <div className="logo-container">
      <img src={logo} alt="Fame Race Logo" />
    </div>
  );
}
