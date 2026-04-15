import './Pages.css';

export default function CalendarioPedidos() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Calendario de Entregas</h1>
          <p className="subtitle">Visualice las entregas programadas de la semana.</p>
        </div>
      </div>

      <div className="card surface-container-lowest ambient-shadow ghost-border">
        <p style={{ color: 'var(--on-surface-variant)' }}>Vista de calendario irá aquí (Mock).</p>
      </div>
    </div>
  );
}
