import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { formatCLP, parseCLP } from '../utils/formatters';

interface Product {
  id: number;
  name: string;
  value: number;
  is_active?: boolean;
  active?: boolean;
}

export default function Productos() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Product | null>(null);

  // Form states
  const [formNombre, setFormNombre] = useState('');
  const [formPrecio, setFormPrecio] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_products');
      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreateModal = () => {
    setEditingProducto(null);
    setFormNombre('');
    setFormPrecio('');
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (producto: Product) => {
    setEditingProducto(producto);
    setFormNombre(producto.name);
    setFormPrecio(producto.value === 0 ? '$ 0' : formatCLP(producto.value));
    setModalError(null);
    setIsModalOpen(true);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseCLP(raw);
    setFormPrecio(raw.length > 0 ? formatCLP(numeric) : '');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formNombre.trim()) {
      setModalError('El nombre del producto es requerido.');
      return;
    }

    const precioNumerico = formPrecio === '' ? 0 : parseCLP(formPrecio);
    setModalLoading(true);
    try {
      if (editingProducto) {
        const { data: resData, error } = await supabase.rpc('update_product', {
          p_product_id: editingProducto.id,
          p_name: formNombre.trim(),
          p_value: precioNumerico
        });
        if (error) throw error;

        // Extraer el nuevo registro recibido
        const newRecord = Array.isArray(resData)
          ? resData[0]
          : (typeof resData === 'object' && resData !== null ? resData : null);

        const newId = newRecord?.id ?? (typeof resData === 'number' ? resData : editingProducto.id);
        const newName = newRecord?.name ?? formNombre.trim();
        const newValue = newRecord?.value !== undefined ? Number(newRecord.value) : precioNumerico;
        const newIsActive = newRecord?.is_active ?? newRecord?.active ?? isProductActive(editingProducto);

        const updatedProduct: Product = {
          id: newId,
          name: newName,
          value: newValue,
          is_active: newIsActive,
          active: newIsActive
        };

        // Modificar la fila donde estaba el producto anterior con los nuevos datos (incluido el nuevo ID)
        setProductos(prev =>
          prev.map(p => (p.id === editingProducto.id ? updatedProduct : p))
        );

        alert('Producto actualizado exitosamente.');
      } else {
        const { error } = await supabase.rpc('create_product', {
          p_name: formNombre.trim(),
          p_value: precioNumerico
        });
        if (error) throw error;
        alert('Producto creado exitosamente.');
        fetchProducts();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error al guardar producto:', err);
      setModalError(err.message || 'Error al guardar el producto');
    } finally {
      setModalLoading(false);
    }
  };

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleToggleActive = async (productId: number) => {
    setTogglingId(productId);
    try {
      const { error } = await supabase.rpc('toggle_product_active', { p_product_id: productId });
      if (error) throw error;
      setProductos(prev =>
        prev.map(p => {
          if (p.id === productId) {
            const current = isProductActive(p);
            return { ...p, is_active: !current, active: !current };
          }
          return p;
        })
      );
    } catch (err: any) {
      console.error('Error al cambiar disponibilidad:', err);
      alert('Error al cambiar la disponibilidad del producto: ' + (err.message || 'Error desconocido'));
      fetchProducts();
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      return;
    }
    setDeletingId(productId);
    try {
      const { error } = await supabase.rpc('soft_delete_product', { p_product_id: productId });
      if (error) throw error;
      alert('Producto eliminado correctamente.');
      fetchProducts();
    } catch (err: any) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar producto: ' + (err.message || 'Error desconocido'));
    } finally {
      setDeletingId(null);
    }
  };

  const isProductActive = (p: Product): boolean => {
    if (p.is_active !== undefined) return p.is_active;
    if (p.active !== undefined) return p.active;
    return true;
  };

  return (
    <div className="p-6 md:p-8 pb-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface">Productos</h3>
          <p className="text-sm text-outline mt-1">Catálogo general de productos y disponibilidad.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Nuevo Producto
        </button>
      </div>

      {/* Products Table Container */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 relative min-h-[250px]">
        {loading && (
          <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">autorenew</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-outline-variant/20">
                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Nombre</th>
                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Valor</th>
                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {productos.length === 0 && !loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-outline">
                    No hay productos en el catálogo. Use el botón "Nuevo Producto" para agregar uno.
                  </td>
                </tr>
              ) : (
                productos.map((producto) => {
                  const active = isProductActive(producto);
                  return (
                    <tr key={producto.id} className="bg-surface hover:bg-primary-fixed/10 transition-colors">
                      <td className="px-6 py-4 font-headline font-bold text-on-surface text-sm">
                        {producto.name}
                      </td>
                      <td className="px-6 py-4 font-headline font-bold text-primary text-sm">
                        {formatCLP(producto.value)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          disabled={togglingId === producto.id}
                          onClick={() => handleToggleActive(producto.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none transition-all disabled:opacity-50 ${
                            active
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 border border-stone-300 hover:bg-stone-300'
                          }`}
                          title="Haga clic para cambiar la disponibilidad"
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${active ? 'bg-emerald-500' : 'bg-stone-400'} ${togglingId === producto.id ? 'animate-ping' : ''}`}></span>
                          {togglingId === producto.id ? 'Actualizando...' : (active ? 'Disponible' : 'No disponible')}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(producto)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-primary hover:bg-primary-container/20 transition-colors flex items-center justify-center"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(producto.id)}
                            disabled={deletingId === producto.id}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-error hover:bg-error-container/20 transition-colors flex items-center justify-center disabled:opacity-50"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1a1c1b]/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-6 md:p-8 border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/20">
              <h2 className="text-xl font-headline font-extrabold text-primary">
                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                className="material-symbols-outlined text-outline hover:text-on-surface"
                onClick={() => setIsModalOpen(false)}
              >
                close
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                  Nombre del Producto *
                </label>
                <input
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2.5 px-3 transition-colors font-bold text-on-surface"
                  placeholder="Ej. Marraqueta Especial"
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                  Valor *
                </label>
                <input
                  required
                  value={formPrecio}
                  onChange={handlePriceChange}
                  className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2.5 px-3 transition-colors font-bold text-[#703210]"
                  placeholder="$ 0"
                  type="text"
                />
              </div>

              {modalError && (
                <div className="bg-error-container text-on-error-container text-xs font-bold p-3 rounded-lg flex items-center">
                  <span className="material-symbols-outlined mr-2 text-base">error</span>
                  {modalError}
                </div>
              )}

              <div className="flex gap-4 border-t border-outline-variant/20 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 text-xs font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                >
                  {modalLoading ? 'Guardando...' : (editingProducto ? 'Guardar Cambios' : 'Crear Producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
