import { useState } from 'react';

export default function VerPedidos() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('calendar');

  // Helper arrays for calendar mockup
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // We'll generate 35 days for a 5 week month simulation
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    // some static mocked logic for dates and active orders
    const date = i - 2; // Offset to start at late previous month
    const isCurrentMonth = date > 0 && date <= 31;
    const hasOrder = date === 5 || date === 12 || date === 18 || date === 24 || date === 27;
    return { date: isCurrentMonth ? date : (date <= 0 ? 30 + date : date - 31), isCurrentMonth, hasOrder };
  });

  return (
    <>
      <div className="p-8 pb-12">
        
        {/* Header Tabs & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex bg-surface-container-highest p-1.5 rounded-xl w-fit shadow-sm border border-outline-variant/30">
            <button 
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'calendar' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-[18px] mr-2">calendar_month</span>
              Order Calendar
            </button>
            <button 
              onClick={() => setActiveTab('table')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'table' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-[18px] mr-2">table_rows</span>
              Detailed List
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-surface-container-high text-on-surface hover:text-primary px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
            </button>
            <button className="bg-[#fec178] text-[#784d0d] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print Report
            </button>
          </div>
        </div>

        {activeTab === 'calendar' ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-headline font-extrabold text-primary">October 2023</h2>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full border border-outline-variant/50 text-outline hover:text-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-2 rounded-full border border-outline-variant/50 text-outline hover:text-primary hover:border-primary transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-outline-variant/20 rounded-xl overflow-hidden border border-outline-variant/20">
              {/* Header */}
              {daysOfWeek.map(day => (
                <div key={day} className="bg-surface-container-highest py-3 text-center text-[10px] font-label font-bold uppercase tracking-wider text-outline">
                  {day}
                </div>
              ))}
              
              {/* Grid */}
              {calendarDays.map((day, idx) => (
                <div key={idx} className={`min-h-[120px] p-3 transition-colors hover:bg-primary-fixed/20 group cursor-pointer ${day.isCurrentMonth ? 'bg-surface' : 'bg-surface-container-highest/20'}`}>
                  <span className={`text-sm font-headline font-bold ${day.isCurrentMonth ? 'text-on-surface' : 'text-outline-variant'}`}>
                    {day.date}
                  </span>
                  
                  {day.hasOrder && (
                    <div className="mt-3 space-y-1">
                      <div className="px-2 py-1 bg-tertiary-container/30 border border-tertiary-container rounded text-[10px] font-bold text-on-tertiary-container truncate">
                        • 5x Croissants
                      </div>
                      {day.date === 27 && (
                        <div className="px-2 py-1 bg-primary-fixed border border-primary/20 rounded text-[10px] font-bold text-on-primary-fixed truncate">
                          • 2x Custom Cakes
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
                <span className="text-outline uppercase tracking-wider">Regular Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-fixed border border-primary/20"></span>
                <span className="text-outline uppercase tracking-wider">Custom Cakes</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
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
        )}
      </div>
      
      {/* Visual Floating Backdrop for Texture */}
      <div className="fixed bottom-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
        <span className="material-symbols-outlined text-[35rem]" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
      </div>
    </>
  );
}
