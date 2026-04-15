import Button from '../components/Button';
import './Pages.css';

export default function CantidadDePan() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Cantidad de Pan</h1>
          <p className="subtitle">Inventario de pan de hoy.</p>
        </div>
        <Button variant="secondary">Actualizar Stock</Button>
      </div>

      <div className="card surface-container-lowest ambient-shadow ghost-border">
        <p style={{ color: 'var(--on-surface-variant)' }}>La cuadratura de cantidad de pan irá aquí.</p>
      </div>
    </div>
  );
}
