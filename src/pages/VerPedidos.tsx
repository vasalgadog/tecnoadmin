import { useState, useEffect, useCallback } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { formatCLP } from '../utils/formatters';

interface Order {
  id: number;
  client_name: string;
  client_phone: string;
  delivery_on: string;
  value: string | number;
  totally_paid: boolean;
  // Optional field for rendering detail column
  detail?: any;
}

export default function VerPedidos() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('table');

  // Supabase Data States
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');
  const [hasMore, setHasMore] = useState(true);

  // Selected order detail handling
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrderDetail = async (orderId: number) => {
    setDetailLoading(true);
    try {
      const { data: res, error } = await supabase.rpc('get_order_detail', { p_order_id: orderId });
      if (error) throw error;
      setSelectedOrder(res);
    } catch (err) {
      console.error('Error fetching order detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRowClick = (row: Order) => {
    // Load detailed info for the clicked order
    fetchOrderDetail(row.id);
  };

  const fetchOrders = useCallback(async (currentPage: number, searchTerm: string, direction: 'asc' | 'desc') => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.rpc('get_orders_paginated', {
        p_page: currentPage,
        p_limit: limit,
        p_search: searchTerm,
        p_order_dir: direction
      });

      if (error) throw error;

      setData(res || []);
      setHasMore((res || []).length === limit);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      const timer = setTimeout(() => {
        fetchOrders(page, search, orderDir);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [page, search, orderDir, fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleOrderDir = () => {
    setOrderDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const columns: Column<Order>[] = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'client_name' },
    { header: 'Teléfono', accessor: 'client_phone' },
    {
      header: (
        <button
          onClick={toggleOrderDir}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          Fecha entrega
          <span className="material-symbols-outlined text-xs">
            {orderDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        </button>
      ),
      accessor: 'delivery_on',
      render: (row) => {
        const d = new Date(row.delivery_on);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    {
      header: 'Total',
      accessor: 'value',
      render: (row) => formatCLP(Number(row.value))
    },
    {
      header: 'Estado pago',
      accessor: 'totally_paid',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${row.totally_paid ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'}`}>
          {row.totally_paid ? 'Pagado' : 'Abonado'}
        </span>
      )
    }
  ];

  // Helper arrays for calendar mockup
  const daysOfWeek = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  // We'll generate 35 days for a 5 week month simulation
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    // some static mocked logic for dates and active orders
    const date = i - 2; // Offset to start at late previous month
    const isCurrentMonth = date > 0 && date <= 31;
    const hasOrder = date === 5 || date === 12 || date === 18 || date === 24 || date === 27;
    return { date: isCurrentMonth ? date : (date <= 0 ? 30 + date : date - 31), isCurrentMonth, hasOrder };
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 md:p-8 h-[calc(100vh-64px)] flex flex-col overflow-y-auto">

        {/* Header Actions & Tools Toolbar */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-3 mb-6 shrink-0">

          {/* Left Dashboard: Calendar Navigation Component */}
          {activeTab === 'calendar' ? (
            <div className="flex items-center gap-2 bg-surface-container-low rounded-lg px-2 py-1 shadow-sm border border-outline-variant/30 text-primary">
              <button className="p-1 rounded-md hover:bg-surface-container-high transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <div className="w-32 text-center">
                <h2 className="text-xl font-headline font-extrabold uppercase tracking-wider text-[#703210]">Oct 2023</h2>
              </div>
              <button className="p-1 rounded-md hover:bg-surface-container-high transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          ) : (
            <div></div> /* Spacer to push right buttons cleanly */
          )}

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            {/* View Toggle */}
            <div className="flex bg-surface-container-highest p-1 rounded-lg w-fit shadow-sm border border-outline-variant/30 text-sm">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-1.5 rounded-md font-bold transition-all flex items-center ${activeTab === 'calendar' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[16px] mr-1.5">calendar_month</span>
                Calendario
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`px-4 py-1.5 rounded-md font-bold transition-all flex items-center ${activeTab === 'table' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-[16px] mr-1.5">table_rows</span>
                Detalles
              </button>
            </div>

            <div className="hidden lg:block w-px bg-outline-variant/30 my-1 mx-1"></div>

            {/* Action Buttons */}
            <button className="bg-surface-container-high text-on-surface hover:text-primary px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filtros
            </button>
            <button className="bg-[#fec178] text-[#784d0d] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">print</span>
              Imprimir Reporte
            </button>
          </div>
        </div>

        {activeTab === 'calendar' ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow border border-outline-variant/40 p-4 md:p-6 lg:p-8 pt-4 md:pt-6 flex-1 min-h-0 flex flex-col">

            <div
              className="grid grid-cols-7 gap-px bg-outline-variant/30 rounded-xl overflow-hidden border-2 border-outline-variant/30 flex-1 min-h-0"
              style={{ gridTemplateRows: 'auto repeat(5, minmax(0, 1fr))' }}
            >
              {/* Header */}
              {daysOfWeek.map(day => (
                <div key={day} className="bg-surface-container py-2 lg:py-3 text-center text-[10px] md:text-[11px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
                  {day}
                </div>
              ))}

              {/* Grid */}
              {calendarDays.map((day, idx) => (
                <div key={idx} className={`p-1.5 md:p-2 lg:p-3 overflow-y-auto transition-colors hover:bg-primary/5 group cursor-pointer border-t border-outline-variant/20 ${day.isCurrentMonth ? 'bg-surface-container-lowest' : 'bg-surface-container-highest/40'}`}>
                  <span className={`text-xs lg:text-sm font-headline font-bold flex justify-end ${day.isCurrentMonth ? 'text-on-surface' : 'text-outline/40'}`}>
                    {day.date}
                  </span>

                  {day.hasOrder && (
                    <div className="mt-1 lg:mt-2 space-y-1 md:space-y-1.5">
                      <div className="px-1.5 py-0.5 md:py-1 bg-[#ffdbcc] border-l-2 border-[#703210] rounded-r text-[9px] md:text-[10px] font-bold text-[#703210] shadow-sm truncate">
                        • 5x Medialunas
                      </div>
                      {day.date === 27 && (
                        <div className="px-1.5 py-0.5 md:py-1 bg-[#703210] border-l-2 border-[#ffdbcc] rounded-r text-[9px] md:text-[10px] font-bold text-white shadow-sm truncate">
                          • 2x Tortas Personalizadas
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-6 text-xs font-label">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary-container/50 border border-tertiary-container"></span>
                <span className="text-outline uppercase tracking-wider">Pedidos Regulares</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-fixed border border-primary/20"></span>
                <span className="text-outline uppercase tracking-wider">Tortas Personalizadas</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Bento Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-surface-container-low p-5 rounded-xl">
                <p className="text-[10px] font-label uppercase text-outline mb-1">Total de Pedidos</p>
                <h3 className="text-2xl font-headline font-extrabold text-primary">124</h3>
                <div className="mt-1 text-[10px] text-secondary font-medium">+12% desde ayer</div>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl border-l-4 border-secondary-container">
                <p className="text-[10px] font-label uppercase text-outline mb-1">Ingresos de Hoy</p>
                <h3 className="text-2xl font-headline font-extrabold text-primary">$1,842.50</h3>
                <div className="mt-1 text-[10px] text-outline opacity-0">spacer</div>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl">
                <p className="text-[10px] font-label uppercase text-outline mb-1">Retiros Pendientes</p>
                <h3 className="text-2xl font-headline font-extrabold text-tertiary">18</h3>
                <div className="mt-1 text-[10px] text-outline opacity-0">spacer</div>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl">
                <p className="text-[10px] font-label uppercase text-outline mb-1">Pago Completado</p>
                <h3 className="text-2xl font-headline font-extrabold text-primary">94%</h3>
                <div className="mt-1 text-[10px] text-outline opacity-0">spacer</div>
              </div>
            </div>

            {/* Search and Filters above Table */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <div className="relative w-full md:w-1/3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                <input
                  type="text"
                  placeholder="Buscar por cliente..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full bg-surface-container-highest rounded-lg border border-outline-variant/10 pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs font-label uppercase text-outline">Ordenar Fecha:</label>
                <select
                  value={orderDir}
                  onChange={(e) => { setOrderDir(e.target.value as 'asc' | 'desc'); setPage(1); }}
                  className="bg-surface-container-highest rounded-lg border border-outline-variant/10 px-3 py-1 text-sm focus:ring-1 focus:ring-primary"
                >
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </div>
            </div>

            {/* Data Table Section */}
            <div className="flex gap-4">
              <div className="flex-1 bg-surface-container-low rounded-xl overflow-hidden shadow-sm relative min-h-[300px] transition-all">{loading && (
                <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10">
                  <span className="material-symbols-outlined animate-spin text-3xl text-primary">autorenew</span>
                </div>
              )}
                <DataTable
                  columns={columns}
                  data={data}
                  onRowClick={handleRowClick}
                  expandedRowRender={(row) => {
                    // Show inline details only on mobile (md:hidden)
                    if (!selectedOrder || selectedOrder.id !== row.id) return null;
                    return (
                      <div className="md:hidden p-4 bg-surface-low">
                        {detailLoading ? (
                          <span className="material-symbols-outlined animate-spin text-xl">autorenew</span>
                        ) : (
                          <div>
                            <h3 className="text-lg font-bold mb-2">Detalle del Pedido</h3>
                            <p><strong>Cliente:</strong> {selectedOrder.client.name}</p>
                            <p><strong>Teléfono:</strong> {selectedOrder.client.phone}</p>
                            <p><strong>Entrega:</strong> {new Date(selectedOrder.delivery_on).toLocaleString()}</p>
                            <p><strong>Valor:</strong> {formatCLP(Number(selectedOrder.value))}</p>
                            <p><strong>Estado:</strong> {selectedOrder.totally_paid ? 'Pagado' : 'Abonado'}</p>
                            {selectedOrder.comment && <p><strong>Comentario:</strong> {selectedOrder.comment}</p>}
                            <div className="mt-2">
                              <h4 className="font-semibold">Productos:</h4>
                              <ul className="list-disc list-inside">
                                {selectedOrder.products.map((p: any) => (
                                  <li key={p.id}>{p.name} x {p.quantity} ({formatCLP(Number(p.unit_value))})</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low">
                  <p className="text-xs text-outline font-label">Página {page}</p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-1.5 text-outline hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-outline"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!hasMore}
                      className="p-1.5 text-outline hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-outline"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Side panel for desktop */}
              {selectedOrder && (
                <div className="hidden md:block w-80 flex-shrink-0 bg-surface-container-low shadow-lg p-4 overflow-y-auto">
                  <button className="top-2 right-2 text-outline hover:text-primary" onClick={() => setSelectedOrder(null)}>
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                  {detailLoading ? (
                    <span className="material-symbols-outlined animate-spin text-2xl">autorenew</span>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold mb-3">Detalle del Pedido</h3>
                      <p><strong>Cliente:</strong> {selectedOrder.client.name}</p>
                      <p><strong>Teléfono:</strong> {selectedOrder.client.phone}</p>
                      <p><strong>Entrega:</strong> {new Date(selectedOrder.delivery_on).toLocaleString()}</p>
                      <p><strong>Valor:</strong> {formatCLP(Number(selectedOrder.value))}</p>
                      <p><strong>Estado:</strong> {selectedOrder.totally_paid ? 'Pagado' : 'Abonado'}</p>
                      {selectedOrder.comment && <p><strong>Comentario:</strong> {selectedOrder.comment}</p>}
                      <div className="mt-2">
                        <h4 className="font-semibold">Productos:</h4>
                        <ul className="list-disc list-inside">
                          {selectedOrder.products.map((p: any) => (
                            <li key={p.id}>{p.name} x {p.quantity} ({formatCLP(Number(p.unit_value))})</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visual Floating Backdrop for Texture */}
        <div className="fixed bottom-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
          <span className="material-symbols-outlined text-[35rem]" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
        </div>
      </div>
    </div>

  );
}
