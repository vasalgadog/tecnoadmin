import Button from '../components/Button';
import BatchProgressCard from '../components/BatchProgressCard';
import Input from '../components/Input';
import './Pages.css';

export default function Inicio() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Inicio</h1>
          <p className="subtitle">Tecnopan Artisanal Management</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Bread Registration */}
        <div className="card surface-container-lowest ghost-border">
          <h2 className="display" style={{ fontSize: '20px', marginBottom: '8px' }}>Bread Registration</h2>
          <p className="subtitle" style={{ marginBottom: '24px' }}>Quick log for daily production</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Input label="Hallulla Stock (kg)" type="number" placeholder="142" />
              </div>
              <Button variant="primary" style={{ marginBottom: '2px' }}>Guardar</Button>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Input label="Francés Stock (kg)" type="number" placeholder="89" />
              </div>
              <Button variant="primary" style={{ marginBottom: '2px' }}>Guardar</Button>
            </div>
          </div>
        </div>

        {/* Order Registration */}
        <div className="card surface-container-lowest ghost-border">
          <h2 className="display" style={{ fontSize: '20px', marginBottom: '8px' }}>Order Registration</h2>
          <p className="subtitle" style={{ marginBottom: '24px' }}>Manage custom artisanal requests</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input as="select" label="Producto" options={[
              { label: 'Sourdough B-12', value: 'sourdough' },
              { label: 'Marraqueta', value: 'marraqueta' },
            ]} />
            <Input label="Cantidad solicitada" type="number" placeholder="0" />
            <Button variant="primary" style={{ marginTop: '8px' }}>Añadir al pedido</Button>
          </div>
        </div>
        
        {/* Expenses */}
        <div className="card surface-container-lowest ghost-border">
          <h2 className="display" style={{ fontSize: '20px', marginBottom: '8px' }}>Register Expense</h2>
          <p className="subtitle" style={{ marginBottom: '24px' }}>Log minor cashouts</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Monto ($)" type="number" placeholder="0" />
            <Input label="Motivo" type="text" placeholder="Ej. Insumos menores" />
            <Button variant="secondary" style={{ marginTop: '8px' }}>Registrar Gasto</Button>
          </div>
        </div>
      </div>

      <div className="section mt-8">
        <h2 className="display" style={{ fontSize: '24px', marginBottom: '16px' }}>Progreso de Lotes Activos</h2>
        <div className="batch-list mt-4">
          <BatchProgressCard title="Sourdough Batch B-12" specs="Temp: 220°C | Tiempo Restante: 12 min" progress={80} />
          <BatchProgressCard title="Marraqueta Lote 5" specs="Temp: 200°C | Tiempo Restante: 5 min" progress={92} />
        </div>
      </div>
    </div>
  );
}
