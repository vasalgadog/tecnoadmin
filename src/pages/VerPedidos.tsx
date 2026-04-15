import Button from '../components/Button';
import StatusChip from '../components/StatusChip';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import Input from '../components/Input';
import './Pages.css';

interface Pedido {
  id: string;
  cliente: string;
  fecha: string;
  monto: string;
  estado: 'pending' | 'processing' | 'done';
}

const data: Pedido[] = [
  { id: 'ORD-992', cliente: 'Panadería Los Reyes', fecha: 'Hoy, 14:30', monto: '$45.000', estado: 'processing' },
  { id: 'ORD-993', cliente: 'Cafetería Central', fecha: 'Hoy, 16:00', monto: '$12.500', estado: 'pending' },
  { id: 'ORD-991', cliente: 'Hotel San Jorge', fecha: 'Hoy, 09:00', monto: '$120.000', estado: 'done' },
];

export default function VerPedidos() {
  const columns: Column<Pedido>[] = [
    { header: 'ID Pedido', accessor: 'id' },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Entrega Estimada', accessor: 'fecha' },
    { header: 'Total', accessor: 'monto' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => <StatusChip status={row.estado} label={row.estado === 'done' ? 'Completado' : row.estado === 'processing' ? 'En Proceso' : 'Pendiente'} />
    },
    {
      header: 'Acciones',
      accessor: 'id',
      render: () => <Button variant="tertiary" style={{ padding: '4px 8px' }}>Ver Detalles</Button>
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="display">Pedidos</h1>
          <p className="subtitle">Gestión y estado de órdenes solicitadas.</p>
        </div>
        <Button variant="primary">Nuevo Pedido</Button>
      </div>

      <div className="card surface-container-highest ghost-border" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input label="Buscar por ID" type="text" placeholder="Ej. ORD-992" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input as="select" label="Estado" options={[
            { label: 'Todos', value: 'all' },
            { label: 'Pendientes', value: 'pending' },
            { label: 'En Proceso', value: 'processing' },
            { label: 'Completados', value: 'done' },
          ]} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input type="date" label="Fecha" />
        </div>
        <Button variant="secondary" style={{ marginBottom: '2px' }}>Filtrar</Button>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
