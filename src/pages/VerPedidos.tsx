import { useState, useEffect, useCallback } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import { supabase } from '../lib/supabase';
import { formatCLP, formatChileanPhone } from '../utils/formatters';

interface Order {
  id: number;
  created_at?: string;
  create_on?: string;
  client_name: string;
  client_phone?: string;
  delivery_on: string;
  value: string | number;
  totally_paid: boolean;
  status?: number;
  paid_amount?: number;
  detail?: any;
}

interface OrdersResponse {
  meta: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
  };
  data: Order[];
}

export default function VerPedidos() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('table');

  // Supabase Data States
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('desc');
  const [orderField, setOrderField] = useState<'delivery_on' | 'created_at'>('delivery_on');
  const [hasMore, setHasMore] = useState(true);

  // Filter States
  const [filterPendientes, setFilterPendientes] = useState(true);
  const [filterEntregados, setFilterEntregados] = useState(false);
  const [filterEliminados, setFilterEliminados] = useState(false);

  // Selected order detail handling
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Report Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportFechaInicio, setReportFechaInicio] = useState('');
  const [reportFechaFin, setReportFechaFin] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Edit Order States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editProducts, setEditProducts] = useState<any[]>([]);
  const [editProductSuggestions, setEditProductSuggestions] = useState<{ id: number | null, suggestions: any[] }>({ id: null, suggestions: [] });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchOrderDetail = async (orderId: number) => {
    setDetailLoading(true);
    try {
      const { data: res, error } = await supabase.rpc('get_order_detail', { p_order_id: orderId });
      if (error) throw error;
      setSelectedOrder({ ...res, id: orderId });
    } catch (err) {
      console.error('Error fetching order detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handlePrintOrder = async (orderId: number) => {
    setPrintLoading(true);
    try {
      const { error } = await supabase.rpc('print_order', { p_order_id: orderId });
      if (error) throw error;
      alert('Pedido enviado a imprimir correctamente.');
    } catch (err: any) {
      console.error('Error al imprimir pedido:', err);
      alert('Error al imprimir pedido: ' + (err.message || 'Error desconocido'));
    } finally {
      setPrintLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }
    setDeleteLoading(true);
    try {
      const { error } = await supabase.rpc('soft_delete_order', { p_order_id: orderId });
      if (error) throw error;
      alert('Pedido eliminado correctamente.');
      setSelectedOrder(null);
      fetchOrders(page, search, orderDir, orderField);
    } catch (err: any) {
      console.error('Error al eliminar pedido:', err);
      alert('Error al eliminar pedido: ' + (err.message || 'Error desconocido'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportError(null);

    if (!reportFechaInicio) {
      setReportError('La fecha de inicio es requerida.');
      return;
    }

    setReportLoading(true);
    try {
      const { error } = await supabase.rpc('generate_order_report', {
        p_fecha1: reportFechaInicio,
        p_fecha2: reportFechaFin || null
      });
      if (error) throw error;
      alert('Trabajo de impresión creado correctamente.');
      setIsReportModalOpen(false);
      setReportFechaInicio('');
      setReportFechaFin('');
    } catch (err: any) {
      console.error('Error al generar reporte:', err);
      setReportError(err.message || 'Error al generar el reporte de impresión');
    } finally {
      setReportLoading(false);
    }
  };

  // Edit Order Logic
  const openEditModal = () => {
    if (!selectedOrder) return;
    setEditPhone(selectedOrder.client?.phone || '');
    setEditProducts(
      selectedOrder.products && selectedOrder.products.length > 0
        ? selectedOrder.products.map((p: any) => ({
          id: p.id || Date.now() + Math.random(),
          db_id: p.product_id || p.id,
          name: p.name,
          quantity: p.quantity,
          product_value: Number(p.unit_value || 0),
          price: Number(p.unit_value || 0) * Number(p.quantity),
          basePrice: Number(p.unit_value || 0)
        }))
        : [{ id: Date.now(), db_id: null, name: '', quantity: 1, product_value: 0, price: 0, basePrice: 0 }]
    );
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const getEditProductSuggestions = async (busqueda: string, rowId: number) => {
    if (busqueda.length < 3) {
      setEditProductSuggestions({ id: rowId, suggestions: [] });
      return;
    }
    try {
      const { data, error } = await supabase.rpc('get_product', { busqueda });
      if (error) throw error;
      if (data && data.length > 0) {
        setEditProductSuggestions({ id: rowId, suggestions: data.map((p: any) => ({ id: p.id, name: p.name, value: p.value })) });
      } else {
        setEditProductSuggestions({ id: rowId, suggestions: [] });
      }
    } catch (err) {
      console.error('Error buscando productos:', err);
    }
  };

  const handleAddEditProduct = () => {
    setEditProducts([...editProducts, { id: Date.now(), db_id: null, name: '', quantity: 1, product_value: 0, price: 0, basePrice: 0 }]);
  };

  const handleUpdateEditProduct = (id: number, field: string, value: any) => {
    setEditProducts(editProducts.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        if (field === 'name') {
          getEditProductSuggestions(value, id);
        }
        return updated;
      }
      return p;
    }));
  };

  const handleSelectEditProduct = (id: number, suggestion: any) => {
    setEditProducts(editProducts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          name: suggestion.name,
          basePrice: suggestion.value,
          product_value: suggestion.value,
          price: suggestion.value * p.quantity,
          db_id: suggestion.id
        };
      }
      return p;
    }));
    setEditProductSuggestions({ id: null, suggestions: [] });
  };

  const handleUpdateEditQuantity = (id: number, delta: number) => {
    setEditProducts(editProducts.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQty, price: (p.product_value || 0) * newQty };
      }
      return p;
    }));
  };

  const handleDeleteEditProduct = (id: number) => {
    if (editProducts.length > 1) {
      setEditProducts(editProducts.filter(p => p.id !== id));
    } else {
      setEditProducts([{ id: Date.now(), db_id: null, name: '', quantity: 1, product_value: 0, price: 0, basePrice: 0 }]);
    }
  };

  const handleSaveEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    const validProducts = editProducts.filter(p => p.name.trim() !== '' && p.db_id);
    if (validProducts.length === 0) {
      setEditError('Debe seleccionar al menos un producto válido.');
      return;
    }

    setEditLoading(true);
    const payload = {
      phone: editPhone,
      client_phone: editPhone,
      client: {
        phone: editPhone
      },
      value: editProducts.reduce((acc, p) => acc + (p.price || 0), 0),
      products: validProducts.map(p => ({
        product_id: p.db_id,
        quantity: p.quantity,
        product_value: p.product_value
      }))
    };

    try {
      const { error } = await supabase.rpc('edit_order', {
        p_order_id: selectedOrder.id,
        p_payload: payload
      });
      if (error) throw error;
      alert('Pedido editado correctamente.');
      setIsEditModalOpen(false);
      fetchOrderDetail(selectedOrder.id);
      fetchOrders(page, search, orderDir, orderField);
    } catch (err: any) {
      console.error('Error al editar pedido:', err);
      setEditError(err.message || 'Error al guardar los cambios del pedido');
    } finally {
      setEditLoading(false);
    }
  };

  const handleRowClick = (row: Order) => {
    // Load detailed info for the clicked order
    fetchOrderDetail(row.id);
    // Open mobile detail panel
    if (window.innerWidth < 768) {
      setIsMobileDetailOpen(true);
    }
  };

  const fetchOrders = useCallback(async (currentPage: number, searchTerm: string, direction: 'desc' | 'asc', field: 'delivery_on' | 'created_at') => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.rpc('get_orders_paginated', {
        p_page: currentPage,
        p_limit: limit,
        p_search: searchTerm,
        p_order_dir: direction
      });

      if (error) throw error;

      const response: OrdersResponse = res;
      let filteredData = response.data || [];

      // Apply client-side filters based on status
      // status: 0 = eliminado, 1 = pendiente, 2 = entregado
      const activeFilters: number[] = [];
      if (filterPendientes) activeFilters.push(1);
      if (filterEntregados) activeFilters.push(2);
      if (filterEliminados) activeFilters.push(0);

      if (activeFilters.length > 0) {
        filteredData = filteredData.filter((order: Order) => {
          return activeFilters.includes(order.status ?? 0);
        });
      }

      // Client-side sort by the selected field
      filteredData.sort((a: Order, b: Order) => {
        const dateA = new Date(a[field] || a.created_at || a.create_on || 0).getTime();
        const dateB = new Date(b[field] || b.created_at || b.create_on || 0).getTime();
        return direction === 'desc' ? dateB - dateA : dateA - dateB;
      });

      setData(filteredData);
      setHasMore(currentPage < (response.meta?.total_pages || 1));
      setTotalCount(response.meta?.total_count || 0);
      setTotalPages(response.meta?.total_pages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [limit, filterPendientes, filterEntregados, filterEliminados]);

  useEffect(() => {
    setPage(1);
  }, [filterPendientes, filterEntregados, filterEliminados, search, orderDir, orderField]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(page, search, orderDir, orderField);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search, orderDir, orderField, fetchOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleOrderDir = () => {
    setOrderDir(prev => (prev === 'desc' ? 'asc' : 'desc'));
    setPage(1);
  };

  const toggleOrderField = (field: 'delivery_on' | 'created_at') => {
    if (orderField === field) {
      toggleOrderDir();
    } else {
      setOrderField(field);
      setOrderDir('desc');
      setPage(1);
    }
  };

  const columns: Column<Order>[] = [
    { header: 'ID', accessor: 'id' },
    {
      header: (
        <button
          onClick={() => toggleOrderField('created_at')}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          Fecha creación
          <span className="material-symbols-outlined text-xs">
            {orderField === 'created_at' ? (orderDir === 'desc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
          </span>
        </button>
      ),
      accessor: 'created_at' as any,
      render: (row) => {
        const dateVal = row.created_at || row.create_on;
        if (!dateVal) return '-';
        const d = new Date(dateVal);
        return isNaN(d.getTime()) ? '-' : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    { header: 'Nombre', accessor: 'client_name' },
    {
      header: (
        <button
          onClick={() => toggleOrderField('delivery_on')}
          className="flex items-center gap-1 text-sm font-medium text-primary"
        >
          Fecha entrega
          <span className="material-symbols-outlined text-xs">
            {orderField === 'delivery_on' ? (orderDir === 'desc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
          </span>
        </button>
      ),
      accessor: 'delivery_on',
      render: (row) => {
        const d = new Date(row.delivery_on);
        return isNaN(d.getTime()) ? '-' : `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    {
      header: 'Total',
      accessor: 'value',
      render: (row) => formatCLP(Number(row.value))
    },
    {
      header: 'Estado Pago',
      accessor: 'totally_paid',
      render: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${row.totally_paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {row.totally_paid ? 'Pagado' : 'Abonado'}
        </span>
      )
    },
    {
      header: 'Estado Entrega',
      accessor: 'status',
      render: (row) => {
        // status: 0 = eliminado, 1 = pendiente, 2 = entregado
        const status = row.status ?? 1;
        const config: Record<number, { bg: string; text: string; label: string }> = {
          0: { bg: 'bg-red-100', text: 'text-red-800', label: 'Eliminado' },
          1: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pendiente' },
          2: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Entregado' }
        };
        const c = config[status] || config[1];
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${c.bg} ${c.text}`}>
            {c.label}
          </span>
        );
      }
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
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-[#fec178] text-[#784d0d] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
            >
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


            {/* Search, Filters and Order above Table */}
            <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
              <div className="relative w-full md:w-auto md:flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                <input
                  type="text"
                  placeholder="Buscar por ID o cliente..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full bg-surface-container-highest rounded-lg border border-outline-variant/10 pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => { setFilterPendientes(!filterPendientes); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filterPendientes
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] mr-1.5">schedule</span>
                  Pendientes
                </button>
                <button
                  onClick={() => { setFilterEntregados(!filterEntregados); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filterEntregados
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] mr-1.5">check_circle</span>
                  Entregados
                </button>
                <button
                  onClick={() => { setFilterEliminados(!filterEliminados); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    filterEliminados
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] mr-1.5">delete</span>
                  Eliminados
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-xs font-label uppercase text-outline">Ordenar Fecha:</label>
                <select
                  value={orderDir}
                  onChange={(e) => { setOrderDir(e.target.value as 'desc' | 'asc'); setPage(1); }}
                  className="bg-surface-container-highest rounded-lg border border-outline-variant/10 px-3 py-1 text-sm focus:ring-1 focus:ring-primary"
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
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
                  expandedRowRender={() => {
                    return null;
                  }}
                />

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low">
                  <p className="text-xs text-outline font-label">Página {page} de {totalPages} — {totalCount} pedidos</p>
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
                      <p><strong>Valor:</strong> {Number(selectedOrder.value) === 0 ? 'Pendiente' : formatCLP(Number(selectedOrder.value))}</p>
                      <p>
                        <strong>Estado Pago:</strong>{' '}
                        {selectedOrder.totally_paid ? 'Pagado' : `Abonado (${formatCLP(Number(selectedOrder.mount_paid || 0))})`}
                      </p>
                      <p>
                        <strong>Estado Entrega:</strong>{' '}
                        {(selectedOrder.status ?? 1) === 0 ? 'Eliminado' : (selectedOrder.status ?? 1) === 2 ? 'Entregado' : 'Pendiente'}
                      </p>
                      {selectedOrder.comment && <p><strong>Comentario:</strong> {selectedOrder.comment}</p>}
                      <div className="mt-2">
                        <h4 className="font-semibold">Productos:</h4>
                        <ul className="list-disc list-inside">
                          {selectedOrder.products.map((p: any) => (
                            <li key={p.id} className={p.removed ? 'text-gray-400 line-through' : ''}>
                              {p.name} x {p.quantity} ({formatCLP(Number(p.unit_value))})
                              {p.removed && <span className="text-[10px] text-red-400 ml-1">(Eliminado)</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex flex-col gap-2">
                        <button
                          onClick={openEditModal}
                          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-xs py-2 px-3 rounded-lg shadow-sm hover:opacity-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                          Editar Pedido
                        </button>
                        <button
                          onClick={() => handlePrintOrder(selectedOrder.id)}
                          disabled={printLoading}
                          className="w-full flex items-center justify-center gap-2 bg-[#fec178] text-[#784d0d] font-bold text-xs py-2 px-3 rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-base">print</span>
                          {printLoading ? 'Imprimiendo...' : 'Imprimir'}
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(selectedOrder.id)}
                          disabled={deleteLoading}
                          className="w-full flex items-center justify-center gap-2 bg-error-container text-on-error-container font-bold text-xs py-2 px-3 rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                          {deleteLoading ? 'Eliminando...' : 'Eliminar Pedido'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Bottom Sheet Detail */}
            {selectedOrder && isMobileDetailOpen && (
              <div className="md:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/40" onClick={() => { setIsMobileDetailOpen(false); setSelectedOrder(null); }} />
                <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-[0_-8px_32px_rgba(0,0,0,0.15)]">
                  <div className="sticky top-0 bg-surface-container-lowest px-5 pt-4 pb-2 border-b border-outline-variant/20 z-10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-8" />
                      <div className="w-10 h-1 bg-outline-variant/40 rounded-full" />
                      <button
                        onClick={() => { setIsMobileDetailOpen(false); setSelectedOrder(null); }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-outline">close</span>
                      </button>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface text-center">Detalle del Pedido</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {detailLoading ? (
                      <div className="flex justify-center py-8">
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">autorenew</span>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">person</span>
                            <div>
                              <p className="text-[10px] font-label uppercase text-outline">Cliente</p>
                              <p className="text-sm font-bold text-on-surface">{selectedOrder.client?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">phone</span>
                            <div>
                              <p className="text-[10px] font-label uppercase text-outline">Telefono</p>
                              <p className="text-sm font-bold text-on-surface">{selectedOrder.client?.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                            <div>
                              <p className="text-[10px] font-label uppercase text-outline">Entrega</p>
                              <p className="text-sm font-bold text-on-surface">{new Date(selectedOrder.delivery_on).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">payments</span>
                            <div>
                              <p className="text-[10px] font-label uppercase text-outline">Valor</p>
                              <p className="text-sm font-bold text-on-surface">
                                {Number(selectedOrder.value) === 0 ? 'Pendiente' : formatCLP(Number(selectedOrder.value))}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-xl ${selectedOrder.totally_paid ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {selectedOrder.totally_paid ? 'check_circle' : 'schedule'}
                            </span>
                            <div>
                              <p className="text-[10px] font-label uppercase text-outline">Estado Pago</p>
                              <p className="text-sm font-bold text-on-surface">
                                {selectedOrder.totally_paid ? 'Pagado' : `Abonado (${formatCLP(Number(selectedOrder.mount_paid || 0))})`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined text-xl ${(selectedOrder.status ?? 1) === 2 ? 'text-emerald-500' : (selectedOrder.status ?? 1) === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                              {(selectedOrder.status ?? 1) === 2 ? 'check_circle' : (selectedOrder.status ?? 1) === 0 ? 'cancel' : 'local_shipping'}
                            </span>
                            <div>
                              <p className="text-[10px] font-label uppercase text-outline">Estado Entrega</p>
                              <p className="text-sm font-bold text-on-surface">
                                {(selectedOrder.status ?? 1) === 0 ? 'Eliminado' : (selectedOrder.status ?? 1) === 2 ? 'Entregado' : 'Pendiente'}
                              </p>
                            </div>
                          </div>
                          {selectedOrder.comment && (
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-primary text-xl">comment</span>
                              <div>
                                <p className="text-[10px] font-label uppercase text-outline">Comentario</p>
                                <p className="text-sm text-on-surface">{selectedOrder.comment}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-surface-container-low rounded-xl p-4">
                          <h4 className="text-[10px] font-label uppercase tracking-widest text-outline font-bold mb-3">Productos</h4>
                          <div className="space-y-2">
                            {selectedOrder.products?.map((p: any) => (
                              <div key={p.id} className={`flex items-center justify-between rounded-lg p-3 ${p.removed ? 'bg-gray-50 line-through' : 'bg-surface-container-lowest'}`}>
                                <div className="flex-1">
                                  <p className={`text-sm font-bold ${p.removed ? 'text-gray-400' : 'text-on-surface'}`}>{p.name}</p>
                                  <p className={`text-[10px] ${p.removed ? 'text-gray-300' : 'text-outline'}`}>x{p.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-sm font-bold ${p.removed ? 'text-gray-400' : 'text-primary'}`}>{formatCLP(Number(p.unit_value))}</p>
                                  {p.removed && <span className="text-[9px] text-red-400 font-bold">(Eliminado)</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <button
                            onClick={openEditModal}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm py-3 px-4 rounded-xl shadow-sm hover:opacity-90 transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Editar Pedido
                          </button>
                          <button
                            onClick={() => handlePrintOrder(selectedOrder.id)}
                            disabled={printLoading}
                            className="w-full flex items-center justify-center gap-2 bg-[#fec178] text-[#784d0d] font-bold text-sm py-3 px-4 rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">print</span>
                            {printLoading ? 'Imprimiendo...' : 'Imprimir'}
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                            disabled={deleteLoading}
                            className="w-full flex items-center justify-center gap-2 bg-error-container text-on-error-container font-bold text-sm py-3 px-4 rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            {deleteLoading ? 'Eliminando...' : 'Eliminar Pedido'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit Order Modal */}
        {isEditModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-[#1a1c1b]/30 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-outline-variant/30">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-xl font-headline font-extrabold text-primary">Editar Pedido #{selectedOrder.id}</h2>
                  <p className="text-xs font-label text-outline mt-0.5">Cliente: <span className="font-bold text-on-surface">{selectedOrder.client?.name}</span></p>
                  <p className="text-xs font-label text-outline mt-0.5">Total: <span className="font-bold text-on-surface">{Number(selectedOrder.value) === 0 ? 'Pendiente' : formatCLP(Number(selectedOrder.value))}</span></p>
                </div>
                <button className="material-symbols-outlined text-outline hover:text-on-surface" onClick={() => setIsEditModalOpen(false)}>close</button>
              </div>

              <form onSubmit={handleSaveEditOrder} className="space-y-5">
                {/* Editable Client Phone */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Teléfono de Contacto *</label>
                  <input
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(formatChileanPhone(e.target.value))}
                    className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 px-3 text-on-surface font-semibold"
                    placeholder="+56 9 XXXX XXXX"
                    type="tel"
                  />
                </div>

                {/* Editable Products Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-label uppercase tracking-widest text-outline font-bold">Productos</h3>
                    <button
                      type="button"
                      onClick={handleAddEditProduct}
                      className="text-white flex items-center text-[10px] font-bold uppercase tracking-wider hover:bg-primary transition-colors bg-primary-container px-2.5 py-1 rounded-md shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[14px] mr-1">add</span> Añadir
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editProducts.map((p) => (
                      <div key={p.id} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:items-center bg-surface-container-low rounded-lg p-2.5 border border-outline-variant/20">
                        {/* Product Search */}
                        <div className="md:col-span-5 relative w-full">
                          <input
                            type="text"
                            required
                            className="w-full bg-surface-container-highest rounded-md border border-outline-variant/10 text-xs font-semibold py-1.5 px-2.5 h-8 focus:ring-1 focus:ring-primary text-on-surface"
                            placeholder="Buscar producto..."
                            value={p.name}
                            onChange={(e) => handleUpdateEditProduct(p.id, 'name', e.target.value)}
                            onFocus={() => { if (p.name.length >= 3) getEditProductSuggestions(p.name, p.id); }}
                            onBlur={() => setTimeout(() => setEditProductSuggestions({ id: null, suggestions: [] }), 200)}
                          />
                          {editProductSuggestions.id === p.id && p.name.length >= 3 && (
                            <div className="absolute z-50 w-full mt-1 bg-surface shadow-xl border border-outline-variant/50 rounded-md overflow-hidden max-h-40 overflow-y-auto left-0">
                              {editProductSuggestions.suggestions.length > 0 ? (
                                editProductSuggestions.suggestions.map((s, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => handleSelectEditProduct(p.id, s)}
                                    className="p-2.5 text-xs hover:bg-surface-variant cursor-pointer text-on-surface flex justify-between items-center border-b border-outline-variant/10 last:border-0"
                                  >
                                    <span className="font-semibold truncate pr-2">{s.name}</span>
                                    <span className="text-primary font-bold whitespace-nowrap">{formatCLP(s.value)}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-2.5 text-xs text-outline italic text-center">No se encontraron productos</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="flex md:col-span-2 items-center bg-surface-container-highest rounded-md overflow-hidden border border-outline-variant/10 h-8 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateEditQuantity(p.id, -1)}
                            className="w-7 h-full text-primary hover:bg-surface-variant transition-colors flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <input
                            type="text"
                            className="w-full bg-transparent text-center border-none text-xs font-bold p-0 focus:ring-0 text-on-surface"
                            value={p.quantity}
                            maxLength={3}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value.replace(/\D/g, '')) || 1;
                              setEditProducts(editProducts.map(prod => prod.id === p.id ? { ...prod, quantity: newQuantity, price: (prod.product_value || 0) * newQuantity } : prod));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateEditQuantity(p.id, 1)}
                            className="w-7 h-full text-primary hover:bg-surface-variant transition-colors flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>

                        {/* Unit Price (product_value) */}
                        <div className="md:col-span-4 relative">
                          <input
                            type="text"
                            className="w-full bg-surface-container-highest rounded-md border border-outline-variant/10 text-xs font-bold py-1.5 px-2.5 h-8 focus:ring-1 focus:ring-primary text-right text-secondary"
                            value={p.product_value ? formatCLP(p.product_value) : ''}
                            placeholder="$ Unitario"
                            onChange={(e) => {
                              const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                              setEditProducts(editProducts.map(prod => prod.id === p.id ? { ...prod, product_value: val, basePrice: val, price: val * prod.quantity } : prod));
                            }}
                          />
                        </div>

                        {/* Delete row */}
                        <div className="md:col-span-1 flex justify-end shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteEditProduct(p.id)}
                            className="w-8 h-8 rounded-md text-outline hover:text-error hover:bg-error/10 transition-all flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Order Total */}
                <div className="bg-surface-container-highest/60 rounded-lg p-3 border border-outline-variant/30 flex justify-between items-center">
                  <span className="text-[10px] font-label uppercase tracking-widest text-outline font-bold">Total del Pedido</span>
                  <span className="text-xl font-headline font-extrabold text-primary">
                    {formatCLP(editProducts.reduce((acc, p) => acc + (p.price || 0), 0))}
                  </span>
                </div>

                {editError && (
                  <div className="bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg flex items-center">
                    <span className="material-symbols-outlined mr-2 text-base">error</span>
                    {editError}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-2.5 text-xs font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                  >
                    {editLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-[#1a1c1b]/30 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-6 md:p-8 border border-outline-variant/30">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-xl font-headline font-extrabold text-primary">Reporte de Pedidos</h2>
                  <p className="text-xs font-label text-outline mt-0.5">Selecciona el rango de fechas para imprimir</p>
                </div>
                <button
                  className="material-symbols-outlined text-outline hover:text-on-surface"
                  onClick={() => { setIsReportModalOpen(false); setReportError(null); }}
                >
                  close
                </button>
              </div>

              <form onSubmit={handleGenerateReport} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Fecha Inicio *</label>
                  <input
                    required
                    type="date"
                    value={reportFechaInicio}
                    onChange={(e) => setReportFechaInicio(e.target.value)}
                    className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 px-3 text-on-surface font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Fecha Fin (opcional)</label>
                  <input
                    type="date"
                    value={reportFechaFin}
                    onChange={(e) => setReportFechaFin(e.target.value)}
                    className="w-full bg-surface-container-highest border-b-2 border-outline-variant/30 border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 px-3 text-on-surface font-semibold"
                  />
                </div>

                {reportError && (
                  <div className="bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg flex items-center">
                    <span className="material-symbols-outlined mr-2 text-base">error</span>
                    {reportError}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => { setIsReportModalOpen(false); setReportError(null); }}
                    className="flex-1 py-2.5 text-xs font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading}
                    className="flex-1 py-2.5 text-xs font-bold bg-[#fec178] text-[#784d0d] rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                  >
                    {reportLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-base mr-1.5">autorenew</span>
                        Generando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base mr-1.5">print</span>
                        Imprimir
                      </>
                    )}
                  </button>
                </div>
              </form>
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
