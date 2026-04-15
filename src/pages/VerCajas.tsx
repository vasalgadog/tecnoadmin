import Button from '../components/Button';
import './Pages.css';

export default function VerCajas() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Gestión de Cajas</h1>
          <p className="subtitle">Listado de cajas registradoras y turnos abiertos.</p>
        </div>
        <Button variant="secondary">Abrir Nueva Caja</Button>
      </div>

      <div className="card surface-container-lowest ambient-shadow ghost-border">
        <p style={{ color: 'var(--on-surface-variant)' }}>No hay cajas registradas aún (Datos Mock).</p>
      </div>
    </div>
  );
}
