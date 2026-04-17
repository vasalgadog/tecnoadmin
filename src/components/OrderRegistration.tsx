import { useState } from 'react';

export default function OrderRegistration() {
  const [paymentStatus, setPaymentStatus] = useState<'abono' | 'pagado'>('pagado');

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-[#d9c2b8]/20 shadow-sm">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-headline font-bold text-on-surface">Order Registration</h2>
          <p className="text-sm text-outline">Manage custom artisanal requests</p>
        </div>
        <div className="bg-surface-container-lowest p-2 rounded-full shadow-sm text-primary flex items-center justify-center">
          <span className="material-symbols-outlined">list_alt</span>
        </div>
      </header>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Customer Name</label>
            <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors text-on-surface" placeholder="e.g. John Doe" type="text" />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Phone Number</label>
            <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors text-on-surface" placeholder="+56 9 ..." type="tel" />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Delivery Date</label>
            <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors text-on-surface" type="date" />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Delivery Time</label>
            <input className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 transition-colors text-on-surface" type="time" />
          </div>
        </div>

        {/* Dynamic Product Section */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-label uppercase tracking-widest text-outline font-bold">Products</h3>
            <button className="text-primary flex items-center text-[10px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity bg-primary-container px-3 py-1.5 rounded-lg" type="button">
              <span className="material-symbols-outlined text-[14px] mr-1">add</span> Add Product
            </button>
          </div>
          <div className="space-y-3">
            <div className="border-2 border-dashed border-outline-variant/30 bg-surface/50 rounded-xl py-6 flex flex-col items-center justify-center text-outline text-center transition-colors hover:border-primary/40 hover:bg-primary-fixed/5 cursor-pointer">
              <p className="text-xs font-medium">Click to add items</p>
            </div>
          </div>
        </div>

        {/* Financial Summary Mockup */}
        <div className="bg-surface-container-highest/40 rounded-xl p-5 border border-outline-variant/20 flex justify-between items-center mt-2 group hover:border-primary/20 transition-colors">
          <span className="text-[10px] font-label uppercase tracking-widest text-outline font-bold group-hover:text-primary transition-colors">Order Total</span>
          <span className="text-2xl font-headline font-extrabold text-primary">$ 0</span>
        </div>

        {/* Payment Status (Moved Down) */}
        <div className="pt-4 space-y-4 border-t border-outline-variant/10">
          <label className="block text-[11px] font-label uppercase tracking-wider text-outline">Payment Type</label>
          <div className="flex space-x-4">
            <label className="flex-1 flex flex-col items-center justify-center py-4 px-4 rounded-xl bg-surface-container-lowest cursor-pointer border-2 transition-all hover:bg-surface-container-highest has-[:checked]:border-tertiary has-[:checked]:bg-tertiary-container/30 has-[:checked]:text-on-tertiary-container text-on-surface-variant">
              <input 
                className="hidden peer" 
                name="payment" 
                type="radio" 
                value="abono" 
                checked={paymentStatus === 'abono'} 
                onChange={() => setPaymentStatus('abono')} 
              />
              <span className="material-symbols-outlined mb-1.5 text-2xl">payments</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Abono</span>
            </label>
            <label className="flex-1 flex flex-col items-center justify-center py-4 px-4 rounded-xl bg-surface-container-lowest cursor-pointer border-2 transition-all hover:bg-surface-container-highest has-[:checked]:border-primary has-[:checked]:bg-primary-container/30 has-[:checked]:text-on-primary-container text-on-surface-variant">
              <input 
                className="hidden peer" 
                name="payment" 
                type="radio" 
                value="pagado" 
                checked={paymentStatus === 'pagado'} 
                onChange={() => setPaymentStatus('pagado')} 
              />
              <span className="material-symbols-outlined mb-1.5 text-2xl">check_circle</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Pagado</span>
            </label>
          </div>

          {/* Conditional Abono Input */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${paymentStatus === 'abono' ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1">
              <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Monto Abonado</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-outline">$</span>
                <input 
                  className="w-full bg-surface-container-highest border-b-2 border-tertiary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-lg font-bold py-3 pl-8 transition-colors text-on-surface" 
                  placeholder="0" 
                  type="number" 
                  disabled={paymentStatus !== 'abono'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center" type="submit">
            <span className="material-symbols-outlined mr-2">shopping_cart_checkout</span>
            Finalize Order
          </button>
        </div>
      </form>
    </div>
  );
}
