import Button from '../components/Button';
import BatchProgressCard from '../components/BatchProgressCard';
import './Pages.css';

export default function Inicio() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Resumen de Operaciones</h1>
          <p className="subtitle">Bienvenido al panel, aquí está el estado actual.</p>
        </div>
        <Button variant="primary">Nueva Producción</Button>
      </div>

      <div className="dashboard-grid">
        <div className="card surface-container-lowest ambient-shadow ghost-border">
          <h3>Órdenes Pendientes</h3>
          <h1 className="display" style={{ color: 'var(--primary-container)' }}>24</h1>
        </div>
        <div className="card surface-container-lowest ambient-shadow ghost-border">
          <h3>En Horno</h3>
          <h1 className="display" style={{ color: 'var(--secondary)' }}>12</h1>
        </div>
        <div className="card surface-container-lowest ambient-shadow ghost-border">
          <h3>Listos para Despacho</h3>
          <h1 className="display" style={{ color: 'var(--on-surface)' }}>48</h1>
        </div>
      </div>

      <div className="section mt-8">
        <h2 className="display" style={{ fontSize: '24px', marginBottom: '16px' }}>Progreso de Lotes</h2>
        <div className="batch-list mt-4">
          <BatchProgressCard title="Sourdough Batch B-12" specs="Temp: 220°C | Tiempo Restante: 12 min" progress={80} />
          <BatchProgressCard title="Marraqueta Lote 5" specs="Temp: 200°C | Tiempo Restante: 5 min" progress={92} />
          <BatchProgressCard title="Hallulla Lote 8" specs="Amasado | Tiempo Restante: 45 min" progress={30} />
        </div>
      </div>
    </div>
  );
}
