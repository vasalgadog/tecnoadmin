import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { formatCLP, parseCLP, formatChileanPhone } from '../utils/formatters';

export default function OrderRegistration() {
  const [paymentStatus, setPaymentStatus] = useState<'abono' | 'pagado'>('pagado');
  const [phone, setPhone] = useState('');
  const [abonoAmount, setAbonoAmount] = useState('');
  // Mockup total for visual feedback
  const [orderTotal] = useState(15400); 

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatChileanPhone(e.target.value));
  };

  const handleAbonoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCLP(rawValue);
    if (rawValue.length > 0) {
      setAbonoAmount(formatCLP(numericValue));
    } else {
      setAbonoAmount('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Order Submitted", { phone, abonoAmount, paymentStatus });
    // Execute backend logic...
  };

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

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Info */}
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Customer Name *</label>
            <input required className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" placeholder="John Doe" type="text" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Phone Number *</label>
            <input required value={phone} onChange={handlePhoneChange} className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" placeholder="+56 9 XXXX XXXX" type="tel" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Delivery Date *</label>
            <input required className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" type="date" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Delivery Time *</label>
            <input required className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" type="time" />
          </div>
        </div>

        {/* Dynamic Product Section */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-label uppercase tracking-widest text-outline font-bold">Products</h3>
            <button className="text-primary flex items-center text-[10px] font-bold uppercase tracking-wider hover:bg-primary-container/80 transition-colors bg-primary-container px-2 py-1 rounded-md" type="button">
              <span className="material-symbols-outlined text-[14px] mr-1">add</span> Add
            </button>
          </div>
          <div className="space-y-2">
            <div className="border border-dashed border-outline-variant/60 bg-surface/50 rounded-lg py-4 flex flex-col items-center justify-center text-outline text-center transition-colors hover:border-primary/40 hover:bg-primary-fixed/5 cursor-pointer">
              <p className="text-[11px] font-medium">Click to add items</p>
            </div>
          </div>
        </div>

        {/* Financial Summary Mockup */}
        <div className="bg-surface-container-highest/60 rounded-lg p-3 border border-outline-variant/30 flex justify-between items-center group hover:border-primary/30 transition-colors">
          <span className="text-[10px] font-label uppercase tracking-widest text-outline font-bold group-hover:text-primary transition-colors">Order Total</span>
          <span className="text-xl font-headline font-extrabold text-primary">{formatCLP(orderTotal)}</span>
        </div>

        {/* Payment Status (High Contrast & Compact) */}
        <div className="pt-2 space-y-3 border-t border-outline-variant/10">
          <label className="block text-[11px] font-label uppercase tracking-wider text-outline">Payment Type *</label>
          <div className="flex space-x-3">
            <label className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg bg-surface cursor-pointer border border-outline-variant/50 transition-all hover:border-primary/50 has-[:checked]:border-secondary has-[:checked]:bg-secondary has-[:checked]:text-white text-on-surface-variant font-bold shadow-sm">
              <input 
                className="hidden peer" 
                name="payment" 
                type="radio" 
                value="abono" 
                checked={paymentStatus === 'abono'} 
                onChange={() => setPaymentStatus('abono')} 
              />
              <span className="material-symbols-outlined mr-2 text-[18px]">payments</span>
              <span className="text-[11px] uppercase tracking-widest">Abono</span>
            </label>
            <label className="flex-1 flex items-center justify-center py-2 px-3 rounded-lg bg-surface cursor-pointer border border-outline-variant/50 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white text-on-surface-variant font-bold shadow-sm">
              <input 
                className="hidden peer" 
                name="payment" 
                type="radio" 
                value="pagado" 
                checked={paymentStatus === 'pagado'} 
                onChange={() => setPaymentStatus('pagado')} 
              />
              <span className="material-symbols-outlined mr-2 text-[18px]">check_circle</span>
              <span className="text-[11px] uppercase tracking-widest">Pagado</span>
            </label>
          </div>

          {/* Conditional Abono Input */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${paymentStatus === 'abono' ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-1">
              <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Monto Abonado *</label>
              <div className="relative">
                <input 
                  required={paymentStatus === 'abono'}
                  value={abonoAmount}
                  onChange={handleAbonoChange}
                  className="w-full bg-surface-container-highest border-b-2 border-secondary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-base font-bold py-2 pl-3 transition-colors text-on-surface" 
                  placeholder="$ 0" 
                  type="text" 
                  disabled={paymentStatus !== 'abono'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="w-full py-3 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all flex justify-center items-center" type="submit">
            <span className="material-symbols-outlined mr-2 text-[20px]">shopping_cart_checkout</span>
            Finalize Order
          </button>
        </div>
      </form>
    </div>
  );
}
