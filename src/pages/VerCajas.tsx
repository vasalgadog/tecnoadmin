export default function VerCajas() {
  const cajas = [
    { id: 'Caja Central 01', usuario: 'Maria G.', apertura: '08:00 AM', ventas: '$450.000', estado: 'processing' },
    { id: 'Caja Pastelería', usuario: 'Jorge P.', apertura: '08:30 AM', ventas: '$210.000', estado: 'done' },
  ];

  return (
    <div className="p-8 pb-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-label uppercase text-outline tracking-wider">Estado de Caja</label>
            <select className="bg-surface-container-highest border-none rounded-sm text-sm focus:ring-0 focus:border-b-2 focus:border-primary px-3 py-2 pr-8 w-44 font-bold text-on-surface">
              <option value="all">Todas</option>
              <option value="open">Abiertas</option>
              <option value="closed">Cerradas</option>
            </select>
          </div>
          <button className="mt-5 p-2 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant rounded-lg transition-colors flex items-center shadow-sm">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-outline-variant/20">
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">ID Estación</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Usuario Asignado</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Hora Apertura</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-right">Ventas (Turno)</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-center">Estado</th>
                <th className="px-6 py-5 text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {cajas.map((caja, index) => (
                <tr key={index} className="bg-surface hover:bg-primary-fixed/10 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-on-surface flex items-center">
                      <span className="material-symbols-outlined text-outline mr-2 text-lg">point_of_sale</span>
                      {caja.id}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm font-medium">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold mr-2">
                        {caja.usuario.charAt(0)}
                      </div>
                      {caja.usuario}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-on-surface">
                    {caja.apertura}
                  </td>
                  <td className="px-6 py-5 text-right font-headline font-bold text-[#703210]">
                    {caja.ventas}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {caja.estado === 'done' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fec178]/20 text-[#784d0d] uppercase tracking-tighter border border-[#fec178]/30">
                        Cerrada
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container uppercase tracking-tighter border border-primary/20">
                        Abierta
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#703210] hover:bg-[#ffdbcc]/50 rounded-lg transition-colors border border-[#703210]/20">
                      Ver Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
