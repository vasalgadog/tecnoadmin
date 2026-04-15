import Button from '../components/Button';
import DataTable, { Column } from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import Input from '../components/Input';
import './Pages.css';

interface Caja {
  id: string;
  usuario: string;
  apertura: string;
  ventas: string;
  estado: 'pending' | 'processing' | 'done';
}

const data: Caja[] = [
  { id: 'Caja Central 01', usuario: 'Maria G.', apertura: '08:00 AM', ventas: '$450.000', estado: 'processing' },
  { id: 'Caja Pastelería', usuario: 'Jorge P.', apertura: '08:30 AM', ventas: '$210.000', estado: 'done' },
];

export default function VerCajas() {
  const columns: Column<Caja>[] = [
    { header: 'ID Estación', accessor: 'id' },
    { header: 'Usuario Asignado', accessor: 'usuario' },
    { header: 'Hora Apertura', accessor: 'apertura' },
    { header: 'Ventas (Turno)', accessor: 'ventas' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => <StatusChip status={row.estado} label={row.estado === 'done' ? 'Cerrada' : row.estado === 'processing' ? 'Abierta' : 'Pendiente'} />
    },
    {
      header: 'Acción',
      accessor: 'id',
      render: () => <Button variant="secondary" style={{ padding: '4px 12px' }}>Ver Info</Button>
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Gestión de Cajas</h1>
          <p className="subtitle">Listado de cajas registradoras y turnos abiertos.</p>
        </div>
        <Button variant="secondary">Abrir Nueva Caja</Button>
      </div>

      <div className="card surface-container-highest ghost-border" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input as="select" label="Estado de Caja" options={[
            { label: 'Todas', value: 'all' },
            { label: 'Abiertas', value: 'open' },
            { label: 'Cerradas', value: 'closed' },
          ]} />
        </div>
        <Button variant="secondary" style={{ marginBottom: '2px' }}>Filtrar</Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
