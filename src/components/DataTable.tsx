import type { ReactNode } from 'react';
import './DataTable.css';

export interface Column<T> {
  header: ReactNode;
  accessor: keyof T;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  expandedRowRender?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends { id: string | number }>({ columns, data, onRowClick, expandedRowRender }: DataTableProps<T>) {
  return (
    <div className="data-table-container ghost-border ambient-shadow">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>
                No hay registros.
              </td>
            </tr>
          ) : (
            data.map((row) => (
<>
                  <tr
                    onClick={() => onRowClick && onRowClick(row)}
                    className="cursor-pointer hover:bg-primary-fixed/20 transition-colors"
                  >
                    {columns.map((col, idx) => (
                      <td key={idx}>
                        {col.render ? col.render(row) : (row[col.accessor] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                  {expandedRowRender && expandedRowRender(row) && (
                    <tr>
                      <td colSpan={columns.length} className="bg-surface-low p-4">
                        {expandedRowRender(row)}
                      </td>
                    </tr>
                  )}
                </>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
