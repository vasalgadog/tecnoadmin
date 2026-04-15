import Button from '../components/Button';
import './Pages.css';

export default function CerrarCaja() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Cerrar Caja</h1>
          <p className="subtitle">Realice e indique los montos para finalizar el turno.</p>
        </div>
      </div>

      <div className="card surface-container-lowest ambient-shadow ghost-border" style={{ maxWidth: '600px' }}>
        <div className="input-group">
          <label>Monto Efectivo Contado ($)</label>
          <input type="number" className="filled-input" placeholder="0" />
        </div>
        <div className="mt-8">
          <Button variant="primary">Confirmar Cierre</Button>
        </div>
      </div>
    </div>
  );
}
