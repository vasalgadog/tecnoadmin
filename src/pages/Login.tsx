import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './Pages.css';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/Inicio');
  };

  return (
    <div className="login-page surface-container-highest flex-center">
      <div className="glass-modal login-card ambient-shadow ghost-border">
        <h1 className="display" style={{ color: 'var(--primary)' }}>Tecnopan</h1>
        <p className="subtitle">Sistema de Gestión de Panadería</p>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Usuario / Email</label>
            <input type="text" className="filled-input" placeholder="admin@tecnopan.cl" />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" className="filled-input" placeholder="••••••••" />
          </div>
          <Button variant="primary" type="submit" className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
