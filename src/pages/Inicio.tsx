import { useState } from 'react';

export default function Inicio() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-[#f9f9f6]/80 backdrop-blur-md flex justify-between items-center px-8 z-40 border-b border-surface-container-high">
        <div className="flex items-center">
          <h2 className="text-xl font-headline font-semibold text-[#703210]">Dashboard Overview</h2>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={() => setIsExpenseModalOpen(true)} className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center">
            <span className="material-symbols-outlined text-sm mr-2">add_circle</span>
            Register Expense
          </button>
          <div className="flex items-center space-x-4 text-stone-500">
            <button className="material-symbols-outlined hover:opacity-80 transition-opacity">notifications</button>
            <button className="material-symbols-outlined hover:opacity-80 transition-opacity">settings</button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="mt-16 p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Panel 1: Bread Registration */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow">
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-headline font-bold text-on-surface">Bread Registration</h2>
                  <p className="text-sm text-outline">Quick log for daily production</p>
                </div>
                <span className="material-symbols-outlined text-primary text-3xl">bakery_dining</span>
              </header>

              {/* Integrated Inventory Totals */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary-fixed-dim">
                  <p className="text-[10px] font-label uppercase tracking-tighter text-outline mb-1">Hallulla Stock</p>
                  <h3 className="text-xl font-headline font-extrabold text-on-surface">142 <span className="text-xs font-normal text-outline">kg</span></h3>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary-fixed-dim">
                  <p className="text-[10px] font-label uppercase tracking-tighter text-outline mb-1">Francés Stock</p>
                  <h3 className="text-xl font-headline font-extrabold text-on-surface">89 <span className="text-xs font-normal text-outline">kg</span></h3>
                </div>
              </div>

              {/* Stock Actual Input */}
              <div className="space-y-2 mb-6">
                <label className="text-xs font-label uppercase tracking-widest text-outline font-semibold">Stock Actual (kg)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-sm">scale</span>
                  <input className="w-full bg-surface-container-high border-none rounded-lg py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary placeholder:text-outline-variant" placeholder="Enter weight..." type="number" />
                </div>
              </div>

              {/* Bread Type Selection */}
              <div className="space-y-4 mb-6">
                <label className="text-xs font-label uppercase tracking-widest text-outline font-semibold">Select Variety</label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center gap-3 p-3 rounded-lg bg-primary-fixed text-on-primary-fixed border-2 border-primary transition-all">
                    <span className="material-symbols-outlined text-2xl">radio_button_checked</span>
                    <span className="font-headline font-bold text-sm">Hallulla</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-variant transition-all group">
                    <span className="material-symbols-outlined text-2xl text-outline group-hover:text-primary transition-colors">radio_button_unchecked</span>
                    <span className="font-headline font-bold text-sm">Francés</span>
                  </button>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-4">
                <label className="text-xs font-label uppercase tracking-widest text-outline font-semibold">Number of Boxes</label>
                <div className="grid grid-cols-5 gap-2">
                  <button className="py-4 rounded-lg bg-surface-container-high font-bold hover:bg-secondary-container transition-colors">1</button>
                  <button className="py-4 rounded-lg bg-surface-container-high font-bold hover:bg-secondary-container transition-colors">2</button>
                  <button className="py-4 rounded-lg bg-surface-container-high font-bold hover:bg-secondary-container transition-colors">3</button>
                  <button className="py-4 rounded-lg bg-surface-container-high font-bold hover:bg-secondary-container transition-colors">4</button>
                  <div className="relative">
                    <input className="w-full h-full py-4 rounded-lg bg-surface-container-highest border-none text-center font-bold focus:ring-2 focus:ring-primary placeholder:text-outline-variant" placeholder="N" type="number" />
                  </div>
                </div>
              </div>

              <button className="w-full mt-10 bg-primary text-white py-4 rounded-lg font-bold shadow-lg hover:scale-[1.01] transition-transform flex justify-center items-center">
                <span className="material-symbols-outlined mr-2">task_alt</span>
                Log Production Batch
              </button>
            </div>
          </section>

          {/* Panel 2: Order Registration */}
          <section className="lg:col-span-7">
            <div className="bg-surface-container-low p-8 rounded-xl border border-[#d9c2b8]/20">
              <header className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-headline font-bold text-on-surface">Order Registration</h2>
                  <p className="text-sm text-outline">Manage custom artisanal requests</p>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                </div>
              </header>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Customer Name</label>
                    <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors" placeholder="e.g. John Doe" type="text" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Phone Number</label>
                    <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors" placeholder="+56 9 ..." type="tel" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Delivery Date</label>
                    <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors" type="date" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Delivery Time</label>
                    <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors" type="time" />
                  </div>
                </div>

                {/* Payment Status */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline">Payment Status</label>
                  <div className="flex space-x-4">
                    <label className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg bg-surface-container-lowest cursor-pointer border-2 border-transparent has-[:checked]:border-secondary-container transition-all">
                      <input className="hidden peer" name="payment" type="radio" />
                      <span className="text-sm font-medium">Abono</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg bg-surface-container-lowest cursor-pointer border-2 border-transparent has-[:checked]:border-secondary-container transition-all">
                      <input className="hidden peer" name="payment" type="radio" />
                      <span className="text-sm font-medium">Pagado</span>
                    </label>
                  </div>
                </div>

                {/* Dynamic Product Section */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-label uppercase tracking-widest text-outline font-bold">Products</h3>
                    <button className="text-primary flex items-center text-xs font-bold hover:underline" type="button">
                      <span className="material-symbols-outlined text-sm mr-1">add</span> Add Product
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-outline-variant/30 rounded-xl py-6 flex flex-col items-center justify-center text-outline text-center">
                      <p className="text-xs font-medium">No other items added</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10">
                  <button className="w-full py-4 rounded-lg bg-primary text-white font-bold hover:opacity-90 transition-opacity flex justify-center items-center shadow-md" type="submit">
                    <span className="material-symbols-outlined mr-2">shopping_cart_checkout</span>
                    Finalize Order
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>

      {/* Modal: Register Expense (Simulated via overlay) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-[#1a1c1b]/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-extrabold text-primary">Register Expense</h2>
              <button className="material-symbols-outlined text-outline hover:text-on-surface" onClick={() => setIsExpenseModalOpen(false)}>close</button>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Valor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-outline">$</span>
                  <input className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-lg font-bold py-4 pl-8" placeholder="0.00" type="number" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Descripción</label>
                <textarea className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 resize-none" placeholder="Explain the expense..." rows={3}></textarea>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsExpenseModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors">Cancel</button>
                <button className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity">Save Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
