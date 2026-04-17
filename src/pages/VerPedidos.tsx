export default function VerPedidos() {
  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center h-16 px-8">
        <h2 className="text-xl font-headline font-bold text-[#703210]">View Orders</h2>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-sm text-sm focus:ring-0 focus:border-b-2 focus:border-primary transition-all w-64" placeholder="Search orders..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#703210] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Register Expense
            </button>
            <button className="text-stone-500 hover:opacity-80 transition-opacity flex items-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-stone-500 hover:opacity-80 transition-opacity flex items-center">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Canvas */}
      <div className="pt-24 px-8 pb-12">
        {/* Filter Bar & Reports */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label uppercase text-outline tracking-wider">Date Range</label>
              <input className="bg-surface-container-highest border-none rounded-sm text-sm focus:ring-0 focus:border-b-2 focus:border-primary px-3 py-2 w-44" type="date" defaultValue="2023-10-27" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-label uppercase text-outline tracking-wider">Status</label>
              <select className="bg-surface-container-highest border-none rounded-sm text-sm focus:ring-0 focus:border-b-2 focus:border-primary px-3 py-2 pr-8 w-44">
                <option>All Statuses</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Partial</option>
              </select>
            </div>
            <button className="mt-5 p-2 text-primary hover:bg-primary-fixed rounded-lg transition-colors flex items-center">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
          <button className="bg-[#fec178] text-[#784d0d] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
            <span className="material-symbols-outlined text-sm">print</span>
            Print Consolidated Report
          </button>
        </div>

        {/* Bento Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-low p-5 rounded-xl">
            <p className="text-[10px] font-label uppercase text-outline mb-1">Total Orders</p>
            <h3 className="text-2xl font-headline font-extrabold text-primary">124</h3>
            <div className="mt-1 text-[10px] text-secondary font-medium">+12% from yesterday</div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl border-l-4 border-secondary-container">
            <p className="text-[10px] font-label uppercase text-outline mb-1">Revenue Today</p>
            <h3 className="text-2xl font-headline font-extrabold text-primary">$1,842.50</h3>
            <div className="mt-1 text-[10px] text-outline opacity-0">spacer</div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl">
            <p className="text-[10px] font-label uppercase text-outline mb-1">Pending Pickups</p>
            <h3 className="text-2xl font-headline font-extrabold text-tertiary">18</h3>
            <div className="mt-1 text-[10px] text-outline opacity-0">spacer</div>
          </div>
          <div className="bg-surface-container-low p-5 rounded-xl">
            <p className="text-[10px] font-label uppercase text-outline mb-1">Payment Completion</p>
            <h3 className="text-2xl font-headline font-extrabold text-primary">94%</h3>
            <div className="mt-1 text-[10px] text-outline opacity-0">spacer</div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest border-b border-outline-variant/20">
                  <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Customer Name</th>
                  <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Date &amp; Time</th>
                  <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Order Details</th>
                  <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-label uppercase tracking-widest text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {/* Row 1 */}
                <tr className="bg-surface hover:bg-primary-fixed/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-on-surface">Alessandro Moretti</div>
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm font-label">+39 333 456 7890</td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold">Oct 27, 2023</div>
                    <div className="text-[10px] text-outline">08:30 AM</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-tertiary-container/40 text-on-tertiary-container px-2 py-0.5 rounded font-medium">2x Sourdough</span>
                      <span className="text-[10px] bg-tertiary-container/40 text-on-tertiary-container px-2 py-0.5 rounded font-medium">5x Croissants</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fec178]/20 text-[#784d0d] uppercase tracking-tighter">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="bg-surface hover:bg-primary-fixed/20 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-on-surface">Elena Rossi</div>
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant text-sm font-label">+39 334 123 9988</td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold">Oct 27, 2023</div>
                    <div className="text-[10px] text-outline">09:15 AM</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-tertiary-container/40 text-on-tertiary-container px-2 py-0.5 rounded font-medium">1x Focaccia</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-error uppercase tracking-tighter">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low">
            <p className="text-xs text-outline font-label">Showing 1-2 of 124 orders</p>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-md">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-xs text-on-surface font-medium transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-xs text-on-surface font-medium transition-colors">3</button>
              <button className="p-1.5 text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Floating Backdrop for Texture */}
      <div className="fixed bottom-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
        <span className="material-symbols-outlined text-[35rem]" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
      </div>
    </>
  );
}
