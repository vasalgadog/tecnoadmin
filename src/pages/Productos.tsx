import { useState } from 'react';
import { formatCLP, parseCLP } from '../utils/formatters';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Hallulla de la Casa', precio: 1500, tipo: 'Pan' },
    { id: 2, nombre: 'Marraqueta / Pan Francés', precio: 1600, tipo: 'Pan' },
    { id: 3, nombre: 'Medialuna Dulce (Manjar)', precio: 800, tipo: 'Bollería' },
    { id: 4, nombre: 'Croissant Mantequilla', precio: 1200, tipo: 'Bollería' },
    { id: 5, nombre: 'Torta de Hojarasca Manjar Pastelera', precio: 18000, tipo: 'Pastel' },
    { id: 6, nombre: 'Empanada de Pino Horno', precio: 2200, tipo: 'Salado' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  // Form states
  const [formNombre, setFormNombre] = useState('');
  const [formPrecio, setFormPrecio] = useState('');
  const [formTipo, setFormTipo] = useState('Pan');

  const openCreateModal = () => {
    setEditingProducto(null);
    setFormNombre('');
    setFormPrecio('');
    setFormTipo('Pan');
    setIsModalOpen(true);
  };

  const openEditModal = (producto: Producto) => {
    setEditingProducto(producto);
    setFormNombre(producto.nombre);
    setFormPrecio(formatCLP(producto.precio));
    setFormTipo(producto.tipo);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      setProductos(productos.filter((p) => p.id !== id));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseCLP(raw);
    setFormPrecio(raw.length > 0 ? formatCLP(numeric) : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const precioNumerico = parseCLP(formPrecio);

    if (editingProducto) {
      // Update
      setProductos(
        productos.map((p) =>
          p.id === editingProducto.id
            ? { ...p, nombre: formNombre, precio: precioNumerico, tipo: formTipo }
            : p
        )
      );
    } else {
      // Create
      const newProducto: Producto = {
        id: Date.now(),
        nombre: formNombre,
        precio: precioNumerico,
        tipo: formTipo,
      };
      setProductos([...productos, newProducto]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 pb-12">
      {/* Header Section */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface">Gestión de Catálogo</h3>
          <p className="text-sm text-outline mt-1">Administre los productos disponibles para pedidos y ventas.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Nuevo Producto
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-outline-variant/20">
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Nombre del Producto</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Tipo / Categoría</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-right">Precio Base</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-outline">
                    No hay productos en el catálogo. Use el botón "Nuevo Producto" para agregar uno.
                  </td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr key={producto.id} className="bg-surface hover:bg-primary-fixed/10 transition-colors">
                    <td className="px-6 py-5 font-headline font-bold text-on-surface text-sm">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
                        producto.tipo === 'Pan'
                          ? 'bg-secondary-fixed text-on-secondary-container border-secondary/20'
                          : producto.tipo === 'Bollería'
                          ? 'bg-primary-fixed text-on-primary-fixed border-primary/20'
                          : producto.tipo === 'Pastel'
                          ? 'bg-tertiary text-white border-tertiary/20'
                          : 'bg-surface-container-highest text-on-surface border-outline-variant/30'
                      }`}>
                        {producto.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-bold text-[#703210] text-sm">
                      {formatCLP(producto.precio)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(producto)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-primary hover:bg-primary-container/20 transition-colors flex items-center justify-center"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-error hover:bg-error-container/20 transition-colors flex items-center justify-center"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1a1c1b]/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-extrabold text-primary">
                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                className="material-symbols-outlined text-outline hover:text-on-surface"
                onClick={() => setIsModalOpen(false)}
              >
                close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                  Nombre del Producto *
                </label>
                <input
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 px-3 transition-colors font-bold text-on-surface"
                  placeholder="Ej. Hallulla Especial"
                  type="text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                    Precio Base *
                  </label>
                  <input
                    required
                    value={formPrecio}
                    onChange={handlePriceChange}
                    className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 px-3 transition-colors font-bold text-[#703210]"
                    placeholder="$ 0"
                    type="text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                    Categoría *
                  </label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value)}
                    className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 px-3 transition-colors font-bold text-on-surface"
                  >
                    <option value="Pan">Pan</option>
                    <option value="Bollería">Bollería</option>
                    <option value="Pastel">Pastel</option>
                    <option value="Salado">Salado</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 border-t border-outline-variant/10 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                >
                  {editingProducto ? 'Guardar Cambios' : 'Añadir Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
