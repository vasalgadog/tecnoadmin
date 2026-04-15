import Button from '../components/Button';
import DataTable, { Column } from '../components/DataTable';
import Input from '../components/Input';
import './Pages.css';

interface HistorialPan {
  id: string;
  hora: string;
  tipo: string;
  kilos: number;
  responsable: string;
  lote: string;
}

const data: HistorialPan[] = [
  { id: '1', hora: '08:30 AM', tipo: 'Hallulla', kilos: 45, responsable: 'Juan M.', lote: 'L-101' },
  { id: '2', hora: '10:15 AM', tipo: 'Francés', kilos: 30, responsable: 'Juan M.', lote: 'L-102' },
  { id: '3', hora: '12:00 PM', tipo: 'Sourdough', kilos: 15, responsable: 'Pedro C.', lote: 'B-12' },
];

export default function CantidadDePan() {
  const columns: Column<HistorialPan>[] = [
    { header: 'Hora', accessor: 'hora' },
    { header: 'Tipo de Pan', accessor: 'tipo' },
    { header: 'Kilos Ingresados', accessor: 'kilos' },
    { header: 'Responsable', accessor: 'responsable' },
    { header: 'Lote', accessor: 'lote' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Cantidad de Pan</h1>
          <p className="subtitle">Inventario de producción histórica.</p>
        </div>
        <Button variant="secondary">Actualizar Stock Manual</Button>
      </div>

      <div className="card surface-container-highest ghost-border" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input type="date" label="Fecha" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input as="select" label="Tipo de Pan" options={[
            { label: 'Todos', value: 'all' },
            { label: 'Hallulla', value: 'hallulla' },
            { label: 'Francés', value: 'frances' },
            { label: 'Sourdough', value: 'sourdough' },
          ]} />
        </div>
        <Button variant="secondary" style={{ marginBottom: '2px' }}>Filtrar</Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
