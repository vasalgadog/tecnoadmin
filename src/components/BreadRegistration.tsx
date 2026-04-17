export default function BreadRegistration() {
  return (
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
  );
}
