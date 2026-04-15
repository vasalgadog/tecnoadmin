import Button from '../components/Button';
import StatusChip from '../components/StatusChip';
import './Pages.css';

export default function VerPedidos() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Pedidos Aprobados</h1>
          <p className="subtitle">Lista de pedidos para preparar.</p>
        </div>
        <Button variant="primary">Nuevo Pedido Manual</Button>
      </div>

      <div className="card surface-container-highest ghost-border">
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--outline-variant)' }}>
          <span style={{ fontWeight: 600 }}>ID Pedido</span>
          <span style={{ fontWeight: 600 }}>Cliente</span>
          <span style={{ fontWeight: 600 }}>Estado</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px' }}>
          <span>#ORD-992</span>
          <span>Panadería Los Reyes</span>
          <StatusChip status="processing" label="En Proceso" />
        </div>
      </div>
    </div>
  );
}
