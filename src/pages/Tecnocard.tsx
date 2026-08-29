import { useState, useMemo } from 'react';

interface Tarjeta {
  id: string;
  rut: string;
  nombre: string;
  visitas: number;
  ultimaVisita: Date | null;
  activa: boolean;
  vencimiento: Date;
}

const INITIAL_DATA: Tarjeta[] = [
  { id: 'TC-0001', rut: '12.345.678-9', nombre: 'Ana García López', visitas: 24, ultimaVisita: new Date('2026-08-12T10:30:00'), activa: true, vencimiento: new Date('2027-08-01') },
  { id: 'TC-0002', rut: '9.876.543-2', nombre: 'Carlos Martínez', visitas: 8, ultimaVisita: new Date('2026-08-10T14:00:00'), activa: true, vencimiento: new Date('2026-12-15') },
  { id: 'TC-0003', rut: '15.432.100-K', nombre: 'María Fernanda Pérez', visitas: 41, ultimaVisita: new Date('2026-08-13T09:15:00'), activa: true, vencimiento: new Date('2027-06-30') },
  { id: 'TC-0004', rut: '7.654.321-5', nombre: 'Roberto Silva', visitas: 3, ultimaVisita: new Date('2026-07-20T11:00:00'), activa: false, vencimiento: new Date('2026-08-01') },
  { id: 'TC-0005', rut: '11.222.333-4', nombre: 'Valentina Rojas', visitas: 17, ultimaVisita: new Date('2026-08-11T16:45:00'), activa: true, vencimiento: new Date('2027-02-28') },
  { id: 'TC-0006', rut: '16.789.012-3', nombre: 'Diego Muñoz Herrera', visitas: 0, ultimaVisita: null, activa: true, vencimiento: new Date('2027-08-13') },
];

const MAX_VISITAS = 50;

const formatFecha = (d: Date | null) => {
  if (!d) return '—';
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatVencimiento = (d: Date) =>
  d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

/** Verifica y formatea un RUT chileno. Retorna el RUT formateado (XX.XXX.XXX-D) o null si es inválido. */
const validarYFormatearRut = (input: string): string | null => {
  // Strip everything except digits and K/k
  const clean = input.replace(/[^\dKk]/g, '').toUpperCase();
  if (clean.length < 2) return null;
  const dv = clean.slice(-1);
  const cuerpo = clean.slice(0, -1);
  if (!/^\d+$/.test(cuerpo)) return null;
  const num = parseInt(cuerpo, 10);
  if (num < 1000000 || num > 99999999) return null;

  // Compute check digit
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  if (dv !== dvEsperado) return null;

  // Format: XX.XXX.XXX-D
  const formatted = cuerpo.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
  return formatted;
};

// ────────────────────────────────────────────────────
// Card Preview Component
// ────────────────────────────────────────────────────
function TarjetaPreview({ tarjeta }: { tarjeta: Tarjeta }) {
  const porcentaje = Math.min((tarjeta.visitas / MAX_VISITAS) * 100, 100);
  const isExpired = tarjeta.vencimiento < new Date();

  return (
    <div className="flex flex-col h-full p-6 gap-6 overflow-y-auto">
      <div>
        <h3 className="text-sm font-label uppercase tracking-widest text-outline font-bold mb-1">Vista Previa</h3>
        <p className="text-xs text-outline">Tarjeta de fidelización Tecnopan</p>
      </div>

      {/* Physical card mockup */}
      <div
        className="relative w-full rounded-2xl overflow-hidden select-none"
        style={{
          aspectRatio: '1.586 / 1',
          background: 'linear-gradient(135deg, #703210 0%, #8c4b27 45%, #a05c35 75%, #5a2800 100%)',
          boxShadow: '0 20px 60px rgba(112,50,16,0.45), 0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: '#fff' }} />
        <div className="absolute -bottom-12 -left-6 w-52 h-52 rounded-full opacity-[0.06]" style={{ background: '#fff' }} />

        {/* Top row */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[9px] font-label uppercase tracking-widest">Tecnopan</p>
            <p className="text-white text-base font-headline font-extrabold leading-tight tracking-tight">Tecnocard</p>
          </div>
          {/* Chip */}
          <div
            className="w-9 h-6 rounded-md"
            style={{ background: 'linear-gradient(135deg, #e8c96b 0%, #c9a227 50%, #e8c96b 100%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)' }}
          />
        </div>

        {/* Card ID */}
        <div className="absolute left-5 right-5" style={{ top: '42%' }}>
          <p className="text-white/40 text-[8px] uppercase tracking-widest font-label mb-0.5">N° Tarjeta</p>
          <p className="text-white font-mono text-sm tracking-[0.2em] font-bold">{tarjeta.id}</p>
        </div>

        {/* Bottom row */}
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-white/40 text-[8px] uppercase tracking-widest font-label mb-0.5">Titular</p>
            <p className="text-white text-[11px] font-bold uppercase tracking-wide leading-tight">{tarjeta.nombre}</p>
            <p className="text-white/60 text-[10px] font-mono mt-0.5">{tarjeta.rut}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-[8px] uppercase tracking-widest font-label mb-0.5">Vence</p>
            <p className={`text-[10px] font-bold ${isExpired ? 'text-red-300' : 'text-white/80'}`}>{formatVencimiento(tarjeta.vencimiento)}</p>
          </div>
        </div>

        {/* Status badge */}
        {!tarjeta.activa && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <span className="text-white font-label font-extrabold text-xs uppercase tracking-widest bg-red-600/80 px-3 py-1 rounded-full">Inactiva</span>
          </div>
        )}
      </div>

      {/* Visit meter */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-label uppercase tracking-wider text-outline font-bold">Visitas Acumuladas</span>
          <span className="text-sm font-headline font-extrabold text-primary">{tarjeta.visitas} <span className="text-xs text-outline font-normal">/ {MAX_VISITAS}</span></span>
        </div>
        <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${porcentaje}%`,
              background: 'linear-gradient(90deg, #703210, #a05c35)',
            }}
          />
        </div>
        <p className="text-[10px] text-outline mt-2">
          {porcentaje < 100 ? `Faltan ${MAX_VISITAS - tarjeta.visitas} visitas para el beneficio máximo` : '¡Beneficio máximo alcanzado! 🎉'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10 text-center">
          <p className="text-[9px] font-label uppercase tracking-widest text-outline font-bold mb-1">Estado</p>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${tarjeta.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tarjeta.activa ? 'bg-green-500' : 'bg-red-500'}`} />
            {tarjeta.activa ? 'Activa' : 'Inactiva'}
          </span>
        </div>
        <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10 text-center">
          <p className="text-[9px] font-label uppercase tracking-widest text-outline font-bold mb-1">Vencimiento</p>
          <p className={`text-[10px] font-bold ${isExpired ? 'text-red-600' : 'text-on-surface'}`}>{formatVencimiento(tarjeta.vencimiento)}</p>
        </div>
      </div>

      {/* Last visit */}
      <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
        <p className="text-[9px] font-label uppercase tracking-widest text-outline font-bold mb-1">Última Visita</p>
        <p className="text-xs font-bold text-on-surface">{formatFecha(tarjeta.ultimaVisita)}</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────
export default function Tecnocard() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(INITIAL_DATA);
  const [filtroRut, setFiltroRut] = useState('');
  const [seleccionada, setSeleccionada] = useState<Tarjeta | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Modal crear tarjeta
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [rutParaCrear, setRutParaCrear] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const registrarVisita = (id: string) => {
    setTarjetas(prev =>
      prev.map(t =>
        t.id === id ? { ...t, visitas: t.visitas + 1, ultimaVisita: new Date() } : t
      )
    );
    // Keep preview in sync
    setSeleccionada(prev => prev?.id === id ? { ...prev, visitas: prev.visitas + 1, ultimaVisita: new Date() } : prev);
    showToast('✅ Visita registrada correctamente');
  };

  const eliminarVisita = (id: string) => {
    setTarjetas(prev =>
      prev.map(t =>
        t.id === id ? { ...t, visitas: Math.max(0, t.visitas - 1) } : t
      )
    );
    setSeleccionada(prev => prev?.id === id ? { ...prev, visitas: Math.max(0, prev.visitas - 1) } : prev);
    showToast('↩️ Visita eliminada');
  };

  const extenderTarjeta = (id: string) => {
    const nuevaFecha = new Date();
    nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
    setTarjetas(prev =>
      prev.map(t =>
        t.id === id ? { ...t, vencimiento: nuevaFecha, activa: true } : t
      )
    );
    setSeleccionada(prev => prev?.id === id ? { ...prev, vencimiento: nuevaFecha, activa: true } : prev);
    showToast('🔄 Tarjeta extendida por 1 año');
  };

  // Filter + sort by última visita desc (nulls last)
  const datosFiltrados = useMemo(() => {
    const q = filtroRut.replace(/\s/g, '').toLowerCase();
    return tarjetas
      .filter(t => t.rut.replace(/[\.\-\s]/g, '').toLowerCase().includes(q) || t.nombre.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
      .sort((a, b) => {
        if (!a.ultimaVisita && !b.ultimaVisita) return 0;
        if (!a.ultimaVisita) return 1;
        if (!b.ultimaVisita) return -1;
        return b.ultimaVisita.getTime() - a.ultimaVisita.getTime();
      });
  }, [tarjetas, filtroRut]);

  // Detect if search looks like a valid RUT not yet registered
  const rutValidoDetectado = useMemo(() => {
    const formatted = validarYFormatearRut(filtroRut.trim());
    if (!formatted) return null;
    const yaExiste = tarjetas.some(t => t.rut === formatted);
    return yaExiste ? null : formatted;
  }, [filtroRut, tarjetas]);

  const abrirModalCrear = (rut: string) => {
    setRutParaCrear(rut);
    setNuevoNombre('');
    setIsModalCrearOpen(true);
  };

  const crearTarjeta = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = tarjetas.length + 1;
    const newId = `TC-${String(nextNum).padStart(4, '0')}`;
    const vencimiento = new Date();
    vencimiento.setFullYear(vencimiento.getFullYear() + 1);
    const nueva: Tarjeta = {
      id: newId,
      rut: rutParaCrear,
      nombre: nuevoNombre.trim(),
      visitas: 0,
      ultimaVisita: null,
      activa: true,
      vencimiento,
    };
    setTarjetas(prev => [...prev, nueva]);
    setSeleccionada(nueva);
    setFiltroRut('');
    setIsModalCrearOpen(false);
    showToast(`✅ Tarjeta ${newId} creada para ${rutParaCrear}`);
  };

  return (
    <div className="p-8 pb-12 relative">
      {/* Toast */}
      <div
        className={`fixed top-20 right-6 z-[70] bg-on-surface text-surface text-sm font-bold px-5 py-3 rounded-xl shadow-xl transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
      >
        {toast}
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface">Tarjetas Tecnocard</h3>
          <p className="text-sm text-outline mt-1">Gestión de tarjetas de fidelización de clientes frecuentes.</p>
        </div>

        {/* RUT Filter */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input
            type="text"
            value={filtroRut}
            onChange={e => setFiltroRut(e.target.value)}
            placeholder="Buscar por RUT, nombre o ID..."
            className="pl-9 pr-4 py-2.5 rounded-lg text-sm bg-surface-container-highest border border-outline-variant/20 focus:outline-none focus:border-primary text-on-surface w-72 transition-colors"
          />
          {filtroRut && (
            <button onClick={() => setFiltroRut('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Layout: table + optional right panel */}
      <div className={`flex gap-6 transition-all duration-300 ${seleccionada ? 'flex-col xl:flex-row' : ''}`}>
        {/* Table */}
        <div className={`bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 flex-1 min-w-0 ${seleccionada ? 'xl:max-w-[calc(100%-340px)]' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/50 border-b border-outline-variant/20">
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">ID Tarjeta</th>
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">RUT</th>
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold hidden md:table-cell">Titular</th>
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-center">Visitas</th>
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold hidden lg:table-cell">
                    <span className="flex items-center gap-1">Última Visita <span className="material-symbols-outlined text-xs">arrow_downward</span></span>
                  </th>
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-center">Estado</th>
                  <th className="px-5 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {datosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-4">
                      {rutValidoDetectado ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-primary-fixed/10 border border-primary/20 rounded-xl px-6 py-5" style={{ animation: 'slideInRight 0.2s ease' }}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface">RUT válido sin tarjeta registrada</p>
                              <p className="text-xs text-outline mt-0.5">
                                <span className="font-mono font-bold text-primary">{rutValidoDetectado}</span> no tiene una Tecnocard activa.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => abrirModalCrear(rutValidoDetectado)}
                            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm flex-shrink-0"
                          >
                            <span className="material-symbols-outlined text-base">add_card</span>
                            Crear Tecnocard
                          </button>
                        </div>
                      ) : (
                        <p className="text-center text-sm text-outline py-8">
                          No se encontraron tarjetas con ese criterio de búsqueda.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  datosFiltrados.map(tarjeta => {
                    const isSelected = seleccionada?.id === tarjeta.id;
                    return (
                      <tr
                        key={tarjeta.id}
                        onClick={() => setSeleccionada(isSelected ? null : tarjeta)}
                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary-fixed/20 border-l-2 border-l-primary' : 'bg-surface hover:bg-primary-fixed/10'}`}
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-bold text-on-surface-variant">{tarjeta.id}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-sm text-on-surface">{tarjeta.rut}</td>
                        <td className="px-5 py-4 text-sm text-on-surface font-bold hidden md:table-cell">{tarjeta.nombre}</td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-headline font-extrabold text-primary text-base">{tarjeta.visitas}</span>
                            <div className="w-12 h-1 bg-surface-container-highest rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${Math.min((tarjeta.visitas / MAX_VISITAS) * 100, 100)}%`, background: 'linear-gradient(90deg, #703210, #a05c35)' }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-outline hidden lg:table-cell">{formatFecha(tarjeta.ultimaVisita)}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${tarjeta.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tarjeta.activa ? 'bg-green-500' : 'bg-red-500'}`} />
                            {tarjeta.activa ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => registrarVisita(tarjeta.id)}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-100 transition-colors flex items-center justify-center"
                              title="Registrar visita"
                            >
                              <span className="material-symbols-outlined text-lg">add_circle</span>
                            </button>
                            <button
                              onClick={() => eliminarVisita(tarjeta.id)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-error hover:bg-error-container/20 transition-colors flex items-center justify-center"
                              title="Eliminar visita"
                              disabled={tarjeta.visitas === 0}
                            >
                              <span className="material-symbols-outlined text-lg">remove_circle</span>
                            </button>
                            <button
                              onClick={() => extenderTarjeta(tarjeta.id)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-primary hover:bg-primary-container/20 transition-colors flex items-center justify-center"
                              title="Extender tarjeta (+ 1 año)"
                            >
                              <span className="material-symbols-outlined text-lg">autorenew</span>
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

          {/* Footer info */}
          <div className="px-5 py-3 border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-xs text-outline">
              {datosFiltrados.length} {datosFiltrados.length === 1 ? 'tarjeta' : 'tarjetas'} encontradas • Ordenadas por última visita
            </p>
            {seleccionada && (
              <button onClick={() => setSeleccionada(null)} className="text-xs text-outline hover:text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">close</span> Cerrar panel
              </button>
            )}
          </div>
        </div>

        {/* Right panel */}
        {seleccionada && (
          <div
            className="w-full xl:w-80 flex-shrink-0 bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden"
            style={{ animation: 'slideInRight 0.25s ease' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">credit_card</span>
                <span className="text-sm font-label uppercase tracking-wider text-outline font-bold">Detalle de Tarjeta</span>
              </div>
              <button
                onClick={() => setSeleccionada(null)}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <TarjetaPreview tarjeta={seleccionada} />
          </div>
        )}
      </div>

      {/* Modal: Crear Tecnocard */}
      {isModalCrearOpen && (
        <div className="fixed inset-0 bg-[#1a1c1b]/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div
            className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8"
            style={{ animation: 'slideInRight 0.2s ease' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">add_card</span>
                </div>
                <div>
                  <h2 className="text-xl font-headline font-extrabold text-primary">Nueva Tecnocard</h2>
                  <p className="text-xs text-outline font-mono mt-0.5">{rutParaCrear}</p>
                </div>
              </div>
              <button
                className="material-symbols-outlined text-outline hover:text-on-surface transition-colors"
                onClick={() => setIsModalCrearOpen(false)}
              >
                close
              </button>
            </div>

            <form onSubmit={crearTarjeta} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                  RUT del Titular
                </label>
                <div className="w-full bg-surface-container-highest/50 rounded-t-sm border-b-2 border-outline-variant/30 py-3 px-3 font-mono font-bold text-primary text-sm">
                  {rutParaCrear}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">
                  Nombre Completo *
                </label>
                <input
                  required
                  autoFocus
                  value={nuevoNombre}
                  onChange={e => setNuevoNombre(e.target.value)}
                  className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 px-3 transition-colors font-bold text-on-surface"
                  placeholder="Ej. Juan Pérez González"
                  type="text"
                />
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-outline text-base mt-0.5">info</span>
                <p className="text-xs text-outline leading-relaxed">
                  La tarjeta se creará con <strong className="text-on-surface">0 visitas</strong>, estado <strong className="text-green-700">Activa</strong> y vigencia de <strong className="text-on-surface">1 año</strong> desde hoy.
                </p>
              </div>

              <div className="flex gap-4 border-t border-outline-variant/10 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalCrearOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">add_card</span>
                  Crear Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

