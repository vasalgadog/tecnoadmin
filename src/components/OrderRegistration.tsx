import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { formatCLP, parseCLP, formatChileanPhone } from '../utils/formatters';

export default function OrderRegistration() {
  const [paymentStatus, setPaymentStatus] = useState<'abono' | 'pagado'>('pagado');
  const [phone, setPhone] = useState('');
  const [abonoAmount, setAbonoAmount] = useState('');
  const [products, setProducts] = useState<any[]>([
    { id: Date.now(), quantity: 1, name: '', price: 0 }
  ]);
  const [error, setError] = useState<string | null>(null);
  
  // Real total dynamically computed
  const orderTotal = products.reduce((acc, curr) => acc + (curr.price || 0), 0); 

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

  const handleAddProduct = () => {
    setProducts([...products, { id: Date.now(), quantity: 1, name: '', price: 0 }]);
    setError(null);
  };

  const handleUpdateProduct = (id: number, field: string, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Business Logic Validations
    if (products.length === 0) {
      setError('El pedido debe tener al menos un producto.');
      return;
    }

    if (paymentStatus === 'abono') {
      const parsedAbono = parseCLP(abonoAmount);
      if (parsedAbono > orderTotal) {
        setError(`El monto abonado no puede ser mayor al total (${formatCLP(orderTotal)}).`);
        return;
      }
    }

    console.log("Order Submitted", { phone, abonoAmount, paymentStatus, products });
    // Execute backend logic...
    alert("Order successfully validated and saved!");
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
            <button onClick={handleAddProduct} className="text-primary flex items-center text-[10px] font-bold uppercase tracking-wider hover:bg-primary-container/80 transition-colors bg-primary-container px-2 py-1 rounded-md" type="button">
              <span className="material-symbols-outlined text-[14px] mr-1">add</span> Add
            </button>
          </div>
          
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 px-1">
             <div className="col-span-4 text-[9px] font-label uppercase text-outline tracking-wider">Cant</div>
             <div className="col-span-5 text-[9px] font-label uppercase text-outline tracking-wider">Producto</div>
             <div className="col-span-3 text-[9px] font-label uppercase text-outline tracking-wider text-right">Valor Final</div>
          </div>

          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="grid grid-cols-12 gap-2 items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                
                {/* Quantity */}
                <div className="col-span-4 flex items-center bg-surface-container-highest rounded-md overflow-hidden border border-outline-variant/10">
                  <button type="button" onClick={() => handleUpdateQuantity(p.id, -1)} className="px-1.5 py-1.5 text-primary hover:bg-surface-variant transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">remove</span>
                  </button>
                  <input 
                    type="text" 
                    className="w-full bg-transparent text-center border-none text-[11px] font-bold p-0 focus:ring-0" 
                    value={p.quantity} 
                    onChange={(e) => handleUpdateProduct(p.id, 'quantity', parseInt(e.target.value) || 1)} 
                  />
                  <button type="button" onClick={() => handleUpdateQuantity(p.id, 1)} className="px-1.5 py-1.5 text-primary hover:bg-surface-variant transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
                
                {/* Product Name Search */}
                <div className="col-span-5 relative">
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-[12px]">search</span>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-surface-container-highest rounded-md border border-outline-variant/10 text-[11px] font-semibold py-1.5 pl-6 pr-1 focus:ring-1 focus:ring-primary placeholder:text-outline-variant" 
                    placeholder="Buscar..." 
                    value={p.name} 
                    onChange={(e) => handleUpdateProduct(p.id, 'name', e.target.value)} 
                  />
                </div>
                
                {/* Final Value */}
                <div className="col-span-3 relative">
                  <input 
                    type="text" 
                    required
                    className="w-full bg-surface-container-highest rounded-md border border-outline-variant/10 text-[11px] font-bold py-1.5 px-1.5 text-right focus:ring-1 focus:ring-primary text-secondary" 
                    value={p.price ? formatCLP(p.price) : ''} 
                    placeholder="$ 0"
                    onChange={(e) => handleUpdateProduct(p.id, 'price', parseCLP(e.target.value))} 
                  />
                </div>

              </div>
            ))}
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
          {error && (
            <div className="mb-4 bg-error-container text-on-error-container text-[11px] font-bold p-3 rounded-lg flex items-center">
              <span className="material-symbols-outlined mr-2 text-lg">error</span>
              {error}
            </div>
          )}
          <button className="w-full py-3 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all flex justify-center items-center" type="submit">
            <span className="material-symbols-outlined mr-2 text-[20px]">shopping_cart_checkout</span>
            Finalize Order
          </button>
        </div>
      </form>
    </div>
  );
}
