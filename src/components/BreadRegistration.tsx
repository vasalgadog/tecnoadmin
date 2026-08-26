import { useState } from 'react';

export default function BreadRegistration() {
  const [variety, setVariety] = useState<'hallulla' | 'frances'>('hallulla');
  const [boxes, setBoxes] = useState<number | 'neto'>(1);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="bg-surface-container-lowest p-8 rounded-xl ambient-shadow">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-headline font-bold text-on-surface">Registro de Pan</h2>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">bakery_dining</span>
      </header>

      {/* Integrated Inventory Totals */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary-fixed-dim">
          <p className="text-[10px] font-label uppercase tracking-tighter text-outline mb-1">Hallulla</p>
          <h3 className="text-xl font-headline font-extrabold text-on-surface">142 <span className="text-xs font-normal text-outline">kg</span></h3>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary-fixed-dim">
          <p className="text-[10px] font-label uppercase tracking-tighter text-outline mb-1">Francés</p>
          <h3 className="text-xl font-headline font-extrabold text-on-surface">89 <span className="text-xs font-normal text-outline">kg</span></h3>
        </div>
      </div>

      {/* Stock Actual Input */}
      <div className="space-y-1 mb-5">
        <label className="text-[10px] font-label uppercase tracking-widest text-outline font-semibold">Peso (kg) *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-[16px]">scale</span>
          <input required className="w-full bg-surface-container-high border-none rounded-lg py-2 pl-9 pr-3 text-sm font-bold focus:ring-2 focus:ring-primary placeholder:text-outline-variant" placeholder="Ingrese el peso..." type="number" />
        </div>
      </div>

      {/* Bread Type Selection */}
      <div className="space-y-2 mb-5">
        <label className="text-[10px] font-label uppercase tracking-widest text-outline font-semibold">Seleccionar Variedad *</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setVariety('hallulla')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${variety === 'hallulla'
              ? 'bg-primary-fixed text-on-primary-fixed border-2 border-primary'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant border-2 border-transparent group'
              }`}
          >
            <span className={`material-symbols-outlined text-lg transition-colors ${variety === 'hallulla' ? '' : 'text-outline group-hover:text-primary'}`}>
              {variety === 'hallulla' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
            <span className="font-headline font-bold text-sm">Hallulla</span>
          </button>

          <button
            type="button"
            onClick={() => setVariety('frances')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${variety === 'frances'
              ? 'bg-primary-fixed text-on-primary-fixed border-2 border-primary'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant border-2 border-transparent group'
              }`}
          >
            <span className={`material-symbols-outlined text-lg transition-colors ${variety === 'frances' ? '' : 'text-outline group-hover:text-primary'}`}>
              {variety === 'frances' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span>
            <span className="font-headline font-bold text-sm">Francés</span>
          </button>
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-label uppercase tracking-widest text-outline font-semibold">Número de Cajas *</label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => setBoxes(num)}
              className={`py-2.5 rounded-lg font-bold transition-colors text-sm ${boxes === num
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-high hover:bg-secondary-container'
                }`}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setBoxes('neto')}
            className={`py-2.5 rounded-lg font-bold transition-colors text-sm ${boxes === 'neto'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface-container-high hover:bg-secondary-container'
              }`}
          >
            Neto
          </button>
        </div>
      </div>

      <button type="submit" className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-bold shadow-md hover:scale-[1.01] transition-transform flex justify-center items-center text-sm">
        <span className="material-symbols-outlined mr-2 text-[20px]">task_alt</span>
        Registrar
      </button>
    </form>
  );
}
