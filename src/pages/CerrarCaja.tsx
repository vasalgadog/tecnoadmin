import Button from '../components/Button';
import Input from '../components/Input';
import './Pages.css';

export default function CerrarCaja() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display" style={{ color: 'var(--primary)' }}>Tecnopan</h1>
          <p className="subtitle">Cerrar Caja — Estación Central 01</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
        
        {/* Left Side: Summary */}
        <div className="card surface-container-highest ghost-border" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', color: 'var(--on-surface)' }}>Station Summary</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px' }}>Ventas del Turno</p>
            <p className="display" style={{ fontSize: '36px', color: 'var(--primary-container)', margin: 0 }}>$450.000</p>
          </div>
          
          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--outline-variant)' }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', marginBottom: '8px' }}>Gastos (Retiros)</p>
            <p className="display" style={{ fontSize: '24px', color: 'var(--tertiary)', margin: 0 }}>$12.500</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="card surface-container-lowest ambient-shadow ghost-border">
          <h2 className="display" style={{ fontSize: '24px', marginBottom: '8px' }}>Declaración de Cierre</h2>
          <p className="subtitle" style={{ marginBottom: '32px' }}>Ingrese los montos físicos contados al finalizar el turno. Al guardar se generará un comprobante digital y se cerrará la sesión actual.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <Input label="Monto Efectivo (Billetes)" type="number" placeholder="0" />
            <Input label="Monto Efectivo (Monedas)" type="number" placeholder="0" />
            <Input label="Vouchers (Transbank)" type="number" placeholder="0" />
            <Input label="Otros Medios de Pago" type="number" placeholder="0" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--outline-variant)', paddingTop: '24px' }}>
            <Button variant="tertiary">Cancelar</Button>
            <Button variant="primary">Guardar / Cerrar Sesión</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
