export default function CantidadDePan() {
  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-[#f9f9f6]/95 backdrop-blur-md flex justify-between items-center px-10 z-40">
        <h2 className="text-2xl font-headline font-bold text-[#703210]">Bread Quantity Inventory</h2>
        <div className="flex items-center space-x-8">
          <button className="bg-[#703210] text-white px-6 py-2.5 rounded-lg text-sm font-label font-bold flex items-center hover:bg-[#5a280d] transition-all shadow-sm">
            <span className="material-symbols-outlined text-sm mr-2">add</span>
            Register Expense
          </button>
          <div className="flex items-center space-x-6 text-stone-400">
            <button className="hover:text-[#703210] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
            <button className="hover:text-[#703210] transition-colors"><span className="material-symbols-outlined">settings</span></button>
          </div>
        </div>
      </header>

      {/* Main Content (Offset adjusted for fixed header) */}
      <div className="pt-28 pb-16 px-10 min-h-screen bg-surface">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Hallulla Card */}
          <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-8 border-l-8 border-secondary-fixed-dim shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Total Daily Stock</p>
                <h3 className="text-4xl font-headline font-extrabold text-primary">Hallulla</h3>
              </div>
              <div className="bg-[#ffdbcc] p-4 rounded-2xl">
                <span className="material-symbols-outlined text-[#703210] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
              </div>
            </div>
            <div className="mt-8 flex items-baseline">
              <span className="text-6xl font-headline font-extrabold text-on-surface tracking-tight">1,240</span>
              <span className="ml-3 text-on-surface-variant font-medium text-lg">units</span>
            </div>
            <div className="mt-6 flex items-center text-sm">
              <span className="text-secondary font-bold flex items-center bg-secondary-fixed/30 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                +12%
              </span>
              <span className="ml-3 text-stone-500 font-label uppercase text-[11px] tracking-widest font-medium">vs yesterday</span>
            </div>
          </div>

          {/* Francés Card */}
          <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-8 border-l-8 border-primary-container shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Total Daily Stock</p>
                <h3 className="text-4xl font-headline font-extrabold text-primary">Francés</h3>
              </div>
              <div className="bg-[#ffddb9] p-4 rounded-2xl">
                <span className="material-symbols-outlined text-[#825516] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>flatware</span>
              </div>
            </div>
            <div className="mt-8 flex items-baseline">
              <span className="text-6xl font-headline font-extrabold text-on-surface tracking-tight">850</span>
              <span className="ml-3 text-on-surface-variant font-medium text-lg">units</span>
            </div>
            <div className="mt-6 flex items-center text-sm">
              <span className="text-error font-bold flex items-center bg-error-container/30 px-2 py-1 rounded">
                <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
                -4%
              </span>
              <span className="ml-3 text-stone-500 font-label uppercase text-[11px] tracking-widest font-medium">vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Registration Details Table Section */}
        <section className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
          <div className="px-10 py-8 flex justify-between items-center bg-surface-container-highest/40">
            <div>
              <h4 className="text-xl font-headline font-bold text-on-surface">Registration Details</h4>
              <p className="text-[11px] text-on-surface-variant font-label uppercase mt-1 tracking-[0.15em] font-bold">Historical Batch Production</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white p-2.5 rounded-lg border border-outline-variant/30 text-stone-600 hover:bg-[#703210] hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </button>
              <button className="bg-white p-2.5 rounded-lg border border-outline-variant/30 text-stone-600 hover:bg-[#703210] hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-xl">download</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/20 border-y border-outline-variant/20">
                  <th className="px-10 py-5 font-label uppercase text-[11px] tracking-[0.15em] font-bold text-on-surface-variant">Timestamp</th>
                  <th className="px-10 py-5 font-label uppercase text-[11px] tracking-[0.15em] font-bold text-on-surface-variant">Batch ID</th>
                  <th className="px-10 py-5 font-label uppercase text-[11px] tracking-[0.15em] font-bold text-on-surface-variant text-right">Hallulla (Units)</th>
                  <th className="px-10 py-5 font-label uppercase text-[11px] tracking-[0.15em] font-bold text-on-surface-variant text-right">Francés (Units)</th>
                  <th className="px-10 py-5 font-label uppercase text-[11px] tracking-[0.15em] font-bold text-on-surface-variant">Status</th>
                  <th className="px-10 py-5 font-label uppercase text-[11px] tracking-[0.15em] font-bold text-on-surface-variant">Registrar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="bg-surface hover:bg-primary-fixed/10 transition-colors">
                  <td className="px-10 py-6 text-sm font-medium text-on-surface">Today, 10:45 AM</td>
                  <td className="px-10 py-6 text-sm font-mono text-[#703210] font-bold tracking-tight">#BT-9928</td>
                  <td className="px-10 py-6 text-base font-bold text-right text-on-surface">320</td>
                  <td className="px-10 py-6 text-base font-bold text-right text-on-surface">150</td>
                  <td className="px-10 py-6">
                    <span className="bg-tertiary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">In Oven</span>
                  </td>
                  <td className="px-10 py-6 text-sm font-medium text-on-surface-variant">M. Rodriguez</td>
                </tr>
                <tr className="bg-surface hover:bg-primary-fixed/10 transition-colors">
                  <td className="px-10 py-6 text-sm font-medium text-on-surface">Today, 08:20 AM</td>
                  <td className="px-10 py-6 text-sm font-mono text-[#703210] font-bold tracking-tight">#BT-9925</td>
                  <td className="px-10 py-6 text-base font-bold text-right text-on-surface">450</td>
                  <td className="px-10 py-6 text-base font-bold text-right text-on-surface">300</td>
                  <td className="px-10 py-6">
                    <span className="bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Ready</span>
                  </td>
                  <td className="px-10 py-6 text-sm font-medium text-on-surface-variant">J. Chen</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="px-10 py-6 bg-surface-container-highest/20 flex justify-center border-t border-outline-variant/20">
            <button className="text-[#703210] font-label text-[11px] uppercase tracking-[0.2em] font-bold flex items-center hover:opacity-70 transition-opacity">
              Load More Entries
              <span className="material-symbols-outlined text-lg ml-2">expand_more</span>
            </button>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="w-16 h-16 bg-[#703210] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
          <div className="absolute right-full mr-4 bg-[#703210] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
            Log Production
          </div>
        </button>
      </div>
    </>
  );
}
