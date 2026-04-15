import Button from '../components/Button';
import Input from '../components/Input';
import './Pages.css';

export default function Inicio() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Dashboard Overview</h1>
          <p className="subtitle">Tecnopan Artisanal Management</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="secondary">Register Expense</Button>
          <Button variant="primary">Nueva Producción</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1fr)', gap: '32px' }}>
        
        {/* Bread Registration Panel */}
        <div className="card surface-container-lowest ghost-border" style={{ alignSelf: 'start' }}>
          <h2 className="display" style={{ fontSize: '20px', marginBottom: '8px' }}>Bread Registration</h2>
          <p className="subtitle" style={{ marginBottom: '32px' }}>Quick log for daily production</p>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
             <div className="card surface-container-lowest ghost-border ambient-shadow" style={{ flex: 1, padding: '16px 24px' }}>
               <h3 style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Hallulla Stock</h3>
               <p className="display" style={{ fontSize: '32px', margin: 0, color: 'var(--primary)' }}>142 kg</p>
             </div>
             <div className="card surface-container-lowest ghost-border ambient-shadow" style={{ flex: 1, padding: '16px 24px' }}>
               <h3 style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Francés Stock</h3>
               <p className="display" style={{ fontSize: '32px', margin: 0, color: 'var(--secondary)' }}>89 kg</p>
             </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--outline-variant)' }}>
             <Input as="select" label="Seleccionar Pan" options={[
               { label: 'Hallulla', value: 'hallulla' }, 
               { label: 'Francés', value: 'frances' }
             ]} />
             <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <Input label="Kilos Producidos" type="number" placeholder="0" />
                </div>
                <Button variant="primary">Registrar Stock</Button>
             </div>
          </div>
        </div>

        {/* Order Registration Panel */}
        <div className="card surface-container-lowest ghost-border" style={{ alignSelf: 'start' }}>
          <h2 className="display" style={{ fontSize: '20px', marginBottom: '8px' }}>Order Registration</h2>
          <p className="subtitle" style={{ marginBottom: '32px' }}>Manage custom artisanal requests</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input label="Nombre del Cliente" type="text" placeholder="Ej. Panadería Central" />
              <Input type="date" label="Fecha de Entrega" />
            </div>
            
            <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '24px' }}>
               <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>Products</h3>
               <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '16px', fontStyle: 'italic' }}>No other items added</p>
               
               <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', backgroundColor: 'var(--surface-container-low)', padding: '16px', borderRadius: '8px' }}>
                 <div style={{ flex: 2 }}>
                   <Input as="select" label="Artículo" options={[
                     { label: 'Sourdough B-12', value: 'sourdough' },
                     { label: 'Marraqueta Premium', value: 'marraqueta' }
                   ]} />
                 </div>
                 <div style={{ width: '100px' }}>
                   <Input label="Cant." type="number" placeholder="1" />
                 </div>
                 <Button variant="secondary" type="button" style={{ marginBottom: '2px' }}>Agregar</Button>
               </div>
            </div>

            <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '24px', marginTop: '8px' }}>
              <Button variant="primary" className="w-full">Generar Orden</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
