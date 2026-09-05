import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatCLP } from '../utils/formatters';

interface OrderProduct {
  name: string;
  unit_value: number;
  quantity: number;
  removed?: boolean;
}

interface OrderDetail {
  id: number;
  client?: { name: string; phone: string };
  delivery_on: string;
  value: number;
  totally_paid: boolean;
  status: number;
  products: OrderProduct[];
  comment?: string;
}

interface DeliverOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelivered?: () => void;
}

export default function DeliverOrderModal({ isOpen, onClose, onDelivered }: DeliverOrderModalProps) {
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState<OrderDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = async () => {
    const id = parseInt(searchId, 10);
    if (isNaN(id)) return;

    setSearchLoading(true);
    setNotFound(false);
    setFoundOrder(null);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.rpc('get_order_detail', { p_order_id: id });
      if (error) throw error;

      if (data && (data.status === 0)) {
        setNotFound(true);
        setErrorMsg('Este pedido ha sido eliminado.');
      } else if (data) {
        setFoundOrder(data);
      } else {
        setNotFound(true);
        setErrorMsg('No se encontro ningun pedido con ese ID.');
      }
    } catch {
      setNotFound(true);
      setErrorMsg('Error al buscar el pedido. Intenta novamente.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!foundOrder) return;

    setDeliverLoading(true);
    try {
      const { error } = await supabase.rpc('deliver_order', { p_order_id: foundOrder.id });
      if (error) throw error;

      setIsDelivered(true);
      setShowToast(true);
      onDelivered?.();
      setTimeout(() => {
        setShowToast(false);
        handleClose();
      }, 2000);
    } catch {
      setErrorMsg('Error al entregar el pedido. Intenta novamente.');
    } finally {
      setDeliverLoading(false);
    }
  };

  const handleClose = () => {
    setSearchId('');
    setFoundOrder(null);
    setNotFound(false);
    setIsDelivered(false);
    setShowToast(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#1a1c1b]/30 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-6 md:p-8 border border-outline-variant/30">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/20">
          <div>
            <h2 className="text-xl font-headline font-extrabold text-primary">Entregar Pedido</h2>
            <p className="text-xs font-label text-outline mt-0.5">Busca el pedido por ID para registrar la entrega</p>
          </div>
          <button
            className="material-symbols-outlined text-outline hover:text-on-surface"
            onClick={handleClose}
          >
            close
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">ID de Pedido *</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 px-3 text-on-surface font-semibold"
                placeholder="Ej: 1052"
                disabled={searchLoading || isDelivered}
              />
              <button
                onClick={handleSearch}
                disabled={searchLoading || isDelivered}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
              >
                {searchLoading ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">search</span>
                )}
                Buscar
              </button>
            </div>
          </div>

          {notFound && (
            <div className="bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg flex items-center">
              <span className="material-symbols-outlined mr-2 text-base">error</span>
              {errorMsg}
            </div>
          )}

          {errorMsg && !notFound && (
            <div className="bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg flex items-center">
              <span className="material-symbols-outlined mr-2 text-base">error</span>
              {errorMsg}
            </div>
          )}

          {foundOrder && (
            <div className="bg-surface-container-low rounded-xl p-4 space-y-3 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-label uppercase text-outline">Pedido #{foundOrder.id}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${isDelivered ? 'bg-emerald-100 text-emerald-800' : foundOrder.totally_paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {isDelivered ? 'Entregado' : foundOrder.totally_paid ? 'Pagado' : 'Abonado'}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{foundOrder.client?.name}</p>
                {foundOrder.client?.phone && (
                  <p className="text-[10px] text-outline mt-0.5">{foundOrder.client.phone}</p>
                )}
              </div>
              {foundOrder.delivery_on && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-outline">calendar_today</span>
                  <span className="text-[10px] text-outline">{new Date(foundOrder.delivery_on).toLocaleString()}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {foundOrder.products?.map((p: OrderProduct, idx: number) => (
                  <span
                    key={idx}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      p.removed
                        ? 'bg-gray-100 text-gray-400 line-through'
                        : 'bg-tertiary-container/40 text-on-tertiary-container'
                    }`}
                  >
                    {p.quantity}x {p.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <span className="text-[10px] font-label uppercase text-outline">Total</span>
                <span className="text-sm font-bold text-primary">
                  {Number(foundOrder.value) === 0 ? 'Pendiente' : formatCLP(Number(foundOrder.value))}
                </span>
              </div>
            </div>
          )}

          {foundOrder && !isDelivered && (
            <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 text-xs font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelivery}
                disabled={deliverLoading}
                className="flex-1 py-2.5 text-xs font-bold bg-emerald-500 text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
              >
                {deliverLoading ? (
                  <span className="material-symbols-outlined text-base animate-spin mr-1.5">autorenew</span>
                ) : (
                  <span className="material-symbols-outlined text-base mr-1.5">check_circle</span>
                )}
                {deliverLoading ? 'Entregando...' : 'Confirmar Entrega'}
              </button>
            </div>
          )}

          {isDelivered && (
            <div className="flex justify-center pt-4 border-t border-outline-variant/20">
              <div className="flex items-center gap-2 text-emerald-500">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                <span className="text-sm font-bold">Entrega registrada</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-[80] animate-bounce">
          <span className="material-symbols-outlined text-lg">check</span>
          <span className="text-sm font-bold">Pedido entregado exitosamente</span>
        </div>
      )}
    </div>
  );
}
