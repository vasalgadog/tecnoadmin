import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { formatCLP, parseCLP, formatChileanPhone } from '../utils/formatters';

import { supabase } from '../lib/supabase';

export default function OrderRegistration() {
  const [paymentStatus, setPaymentStatus] = useState<'abono' | 'pagado'>('pagado');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientSuggestions, setClientSuggestions] = useState<any[]>([]);
  const [isClientSuggestionsOpen, setIsClientSuggestionsOpen] = useState(false);

  const [abonoAmount, setAbonoAmount] = useState('');
  const [products, setProducts] = useState<any[]>([
    { id: Date.now(), db_id: null, quantity: 1, name: '', price: 0, basePrice: 0 }
  ]);
  const [activeProductSuggestions, setActiveProductSuggestions] = useState<{ id: number | null, suggestions: any[] }>({ id: null, suggestions: [] });
  const [error, setError] = useState<string | null>(null);

  const [clientId, setClientId] = useState<string | null>(null);
  const [originalPhone, setOriginalPhone] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<number>(1);

  const now = new Date();
  const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  // Real total dynamically computed
  const orderTotal = products.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const get_client = async (busqueda: string) => {
    if (busqueda.length < 3) {
      setClientSuggestions([]);
      setIsClientSuggestionsOpen(false);
      return;
    }
    try {
      console.log('Buscando cliente:', busqueda);
      const { data, error } = await supabase.rpc('get_client', { busqueda });
      if (error) throw error;
      console.log('Resultado clientes:', data);

      if (data && data.length > 0) {
        setClientSuggestions(data.map((c: any) => ({ ID: c.id, Name: c.name, Phone: c.phone })));
      } else {
        setClientSuggestions([]);
      }
      setIsClientSuggestionsOpen(true);
    } catch (err) {
      console.error('Error en get_client:', err);
    }
  };

  const get_product = async (busqueda: string, rowId: number) => {
    if (busqueda.length < 3) {
      setActiveProductSuggestions({ id: rowId, suggestions: [] });
      return;
    }
    try {
      console.log('Buscando producto:', busqueda);
      const { data, error } = await supabase.rpc('get_product', { busqueda });
      if (error) throw error;
      console.log('Resultado productos:', data);

      if (data && data.length > 0) {
        setActiveProductSuggestions({ id: rowId, suggestions: data.map((p: any) => ({ id: p.id, name: p.name, value: p.value })) });
      } else {
        setActiveProductSuggestions({ id: rowId, suggestions: [] }); // Mantener el ID activo pero sin sugerencias
      }
    } catch (err) {
      console.error('Error en get_product:', err);
    }
  };

  const handleClientNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClientName(val);
    setClientId(null);
    setOriginalPhone(null);
    get_client(val);
  };

  const selectClient = (client: any) => {
    setClientName(client.Name);
    setPhone(client.Phone || '');
    setClientId(client.ID);
    setOriginalPhone(client.Phone || '');
    setIsClientSuggestionsOpen(false);
  };

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
    setProducts([...products, { id: Date.now(), db_id: null, quantity: 1, name: '', price: 0, basePrice: 0 }]);
    setError(null);
  };

  const handleUpdateProduct = (id: number, field: string, value: any) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        if (field === 'name') {
          get_product(value, id);
        }
        return updated;
      }
      return p;
    }));
  };

  const handleSelectProduct = (id: number, suggestion: any) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, name: suggestion.name, basePrice: suggestion.value, price: suggestion.value * p.quantity, db_id: suggestion.id };
      }
      return p;
    }));
    setActiveProductSuggestions({ id: null, suggestions: [] });
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newQuantity = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQuantity, price: (p.basePrice || 0) * newQuantity };
      }
      return p;
    }));
  };

  const handleDeleteProduct = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      setProducts([{ id: Date.now(), db_id: null, quantity: 1, name: '', price: 0, basePrice: 0 }]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Business Logic Validations
    const hasValidProduct = products.some(p => p.name.trim() !== '' && p.price > 0 && p.db_id);
    if (!hasValidProduct) {
      setError('El pedido debe tener al menos un producto válido seleccionado.');
      return;
    }

    if (paymentStatus === 'abono') {
      const parsedAbono = parseCLP(abonoAmount);
      if (parsedAbono > orderTotal) {
        setError(`El monto abonado no puede ser mayor al total (${formatCLP(orderTotal)}).`);
        return;
      }
    }

    if (!deliveryDate || !deliveryTime) {
      setError('Por favor ingrese la fecha y hora de entrega.');
      return;
    }

    const selectedDateTime = new Date(`${deliveryDate}T${deliveryTime}`);
    if (selectedDateTime < new Date()) {
      setError('La fecha y hora de entrega no pueden estar en el pasado.');
      return;
    }

    const timeParts = deliveryTime.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes < 450 || totalMinutes > 1170) {
      setError('El horario de entrega debe ser entre las 07:30 y las 19:30.');
      return;
    }

    // Build the payload
    const payload: any = {
      delivery_date: `${deliveryDate}T${deliveryTime}:00Z`,
      value: orderTotal,
      method: paymentMethod,
      mount_paid: paymentStatus === 'abono' ? parseCLP(abonoAmount) : orderTotal,
      totally_paid: paymentStatus === 'pagado',
      comment: comment,
      products: products.filter(p => p.name.trim() !== '' && p.price > 0 && p.db_id).map(p => ({
        product_id: p.db_id,
        quantity: p.quantity
      }))
    };

    if (clientId) {
      payload.client_id = clientId;
      if (phone !== originalPhone) {
        payload.client = { phone };
      }
    } else {
      payload.client_id = null;
      payload.client = {
        name: clientName,
        phone: phone
      };
    }

    console.log("Order Payload:", payload);

    try {
      const { error: submitError } = await supabase.rpc('create_bakery_order', { p_payload: payload });
      if (submitError) throw submitError;
      
      const productList = products
        .filter(p => p.name.trim() !== '' && p.price > 0 && p.db_id)
        .map(p => `- ${p.quantity}x ${p.name}`)
        .join('\n');
        
      alert(`Pedido agendado:\nNombre: ${clientName}\nFecha: ${deliveryDate}\nHora: ${deliveryTime}\nProductos:\n${productList}`);

      // Reset form
      setClientName('');
      setPhone('');
      setClientId(null);
      setOriginalPhone(null);
      setDeliveryDate('');
      setDeliveryTime('');
      setComment('');
      setProducts([{ id: Date.now(), db_id: null, quantity: 1, name: '', price: 0, basePrice: 0 }]);
      setPaymentStatus('pagado');
      setPaymentMethod(1);
      setAbonoAmount('');
      setActiveProductSuggestions({ id: null, suggestions: [] });
      setClientSuggestions([]);
      setIsClientSuggestionsOpen(false);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar el pedido');
    }
  };

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-[#d9c2b8]/20 shadow-sm">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-headline font-bold text-on-surface">Registro de Pedidos</h2>
        </div>
        <div className="bg-surface-container-lowest p-2 rounded-full shadow-sm text-primary flex items-center justify-center">
          <span className="material-symbols-outlined">list_alt</span>
        </div>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Info */}
          <div className="space-y-1 relative">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Nombre del Cliente *</label>
            <input
              required
              value={clientName}
              onChange={handleClientNameChange}
              onFocus={() => { if (clientName.length >= 3) setIsClientSuggestionsOpen(true) }}
              onBlur={() => setTimeout(() => setIsClientSuggestionsOpen(false), 200)}
              className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface"
              placeholder="Juan Pérez"
              type="text"
            />
            {isClientSuggestionsOpen && clientName.length >= 3 && (
              <div className="absolute z-50 w-full mt-1 bg-surface shadow-xl border border-outline-variant/50 rounded-md overflow-hidden max-h-48 overflow-y-auto left-0">
                {clientSuggestions.length > 0 ? (
                  clientSuggestions.map((c, idx) => (
                    <div key={idx} onClick={() => selectClient(c)} className="p-3 text-sm hover:bg-surface-variant cursor-pointer text-on-surface flex justify-between items-center border-b border-outline-variant/10 last:border-0">
                      <span className="font-semibold truncate pr-2">{c.Name}</span>
                      <span className="text-outline text-xs whitespace-nowrap">{c.Phone}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-outline italic text-center">No se encontraron clientes</div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Número de Teléfono *</label>
            <input required value={phone} onChange={handlePhoneChange} className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" placeholder="+56 9 XXXX XXXX" type="tel" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Fecha de Entrega *</label>
            <input required min={todayStr} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" type="date" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Hora de Entrega *</label>
            <input required value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" type="time" />
          </div>
        </div>

        {/* Dynamic Product Section */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-label uppercase tracking-widest text-outline font-bold">Productos</h3>
            <button onClick={handleAddProduct} className="text-primary flex items-center text-[10px] font-bold uppercase tracking-wider hover:bg-primary-container/80 transition-colors bg-primary-container px-2 py-1 rounded-md" type="button">
              <span className="material-symbols-outlined text-[14px] mr-1">add</span> Añadir
            </button>
          </div>

          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 px-1">
            <div className="col-span-2 text-[9px] font-label uppercase text-outline tracking-wider">Cant</div>
            <div className="col-span-7 text-[9px] font-label uppercase text-outline tracking-wider">Producto</div>
            <div className="col-span-2 text-[9px] font-label uppercase text-outline tracking-wider text-right">Valor</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col md:grid md:grid-cols-12 gap-2 md:items-center bg-surface-container-low rounded-lg p-3 md:p-1 border border-outline-variant/20">

                {/* Product Name Search - Moves to top row on mobile */}
                <div className="md:col-span-7 md:order-2 relative w-full">
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-[14px]">search</span>
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-container-highest rounded-md border border-outline-variant/10 text-[10px] font-semibold py-2 pl-6 pr-1 h-9 focus:ring-1 focus:ring-primary placeholder:text-outline-variant"
                    placeholder="Buscar producto..."
                    value={p.name}
                    onChange={(e) => handleUpdateProduct(p.id, 'name', e.target.value)}
                    onFocus={() => { if (p.name.length >= 3) get_product(p.name, p.id); }}
                    onBlur={() => setTimeout(() => setActiveProductSuggestions({ id: null, suggestions: [] }), 200)}
                  />
                  {activeProductSuggestions.id === p.id && p.name.length >= 3 && (
                    <div className="absolute z-50 w-full mt-1 bg-surface shadow-xl border border-outline-variant/50 rounded-md overflow-hidden max-h-48 overflow-y-auto left-0">
                      {activeProductSuggestions.suggestions.length > 0 ? (
                        activeProductSuggestions.suggestions.map((s, idx) => (
                          <div key={idx} onClick={() => handleSelectProduct(p.id, s)} className="p-3 text-sm hover:bg-surface-variant cursor-pointer text-on-surface flex justify-between items-center border-b border-outline-variant/10 last:border-0">
                            <span className="font-semibold truncate flex-1 pr-2">{s.name}</span>
                            <span className="text-primary font-bold text-xs whitespace-nowrap shrink-0">{formatCLP(s.value)}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-outline italic text-center">No se encontraron productos</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Secondary row container for mobile (Quantity, Value, Delete) */}
                <div className="flex items-center gap-2 md:contents w-full">

                  {/* Quantity - Narrower and Taller */}
                  <div className="flex md:col-span-2 md:order-1 items-center bg-surface-container-highest rounded-md overflow-hidden border border-outline-variant/10 h-9 shrink-0">
                    <button type="button" onClick={() => handleUpdateQuantity(p.id, -1)} className="w-6 h-full text-primary hover:bg-surface-variant transition-colors flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <input
                      type="text"
                      className="w-10 md:w-full bg-transparent text-center border-none text-[11px] font-extrabold p-0 focus:ring-0 min-w-0"
                      value={p.quantity}
                      maxLength={3}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value.replace(/\D/g, '')) || 1;
                        setProducts(products.map(prod => prod.id === p.id ? { ...prod, quantity: newQuantity, price: (prod.basePrice || 0) * newQuantity } : prod));
                      }}
                    />
                    <button type="button" onClick={() => handleUpdateQuantity(p.id, 1)} className="w-6 h-full text-primary hover:bg-surface-variant transition-colors flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>

                  {/* Final Value - Flex-1 on mobile */}
                  <div className="flex-1 md:col-span-2 md:order-3 relative">
                    <input
                      type="text"
                      required
                      className="w-full bg-surface-container-highest rounded-md border border-outline-variant/10 text-[10px] font-bold py-2 px-1 text-right h-9 focus:ring-1 focus:ring-primary text-secondary"
                      value={p.price ? formatCLP(p.price) : ''}
                      placeholder="$ 0"
                      onChange={(e) => {
                        const val = parseCLP(e.target.value);
                        if (val.toString().length <= 6) {
                          handleUpdateProduct(p.id, 'price', val);
                        }
                      }}
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="md:col-span-1 md:order-4 flex justify-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id)}
                      className="w-9 h-9 md:w-7 md:h-7 rounded-md text-outline hover:text-error hover:bg-error/10 transition-all flex items-center justify-center bg-surface-container-highest md:bg-transparent border border-outline-variant/10 md:border-transparent"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary Mockup */}
        <div className="bg-surface-container-highest/60 rounded-lg p-3 border border-outline-variant/30 flex justify-between items-center group hover:border-primary/30 transition-colors">
          <span className="text-[10px] font-label uppercase tracking-widest text-outline font-bold group-hover:text-primary transition-colors">Total del Pedido</span>
          <span className="text-xl font-headline font-extrabold text-primary">{formatCLP(orderTotal)}</span>
        </div>

        <div className="pt-3 space-y-1">
          <label className="block text-[10px] font-label uppercase tracking-wider text-outline px-1">Comentario</label>
          <input value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-2 transition-colors text-on-surface" placeholder="Alguna observación adicional..." type="text" />
        </div>

        {/* Payment Status (High Contrast & Compact) */}
        <div className="pt-2 space-y-3 border-t border-outline-variant/10">
          <label className="block text-[11px] font-label uppercase tracking-wider text-outline">Tipo de Pago *</label>
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

          {/* Payment Method Selector */}
          <div className="pt-2">
            <label className="block text-[11px] font-label uppercase tracking-wider text-outline mb-2">Método de Pago *</label>
            <div className="flex space-x-2">
              <label className="flex-1 flex items-center justify-center py-2 px-1 rounded-lg bg-surface cursor-pointer border border-outline-variant/50 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white text-on-surface-variant font-bold shadow-sm">
                <input className="hidden peer" name="pay_method" type="radio" value={1} checked={paymentMethod === 1} onChange={() => setPaymentMethod(1)} />
                <span className="material-symbols-outlined mr-1 text-[16px]">payments</span>
                <span className="text-[10px] uppercase tracking-widest">Efectivo</span>
              </label>
              <label className="flex-1 flex items-center justify-center py-2 px-1 rounded-lg bg-surface cursor-pointer border border-outline-variant/50 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white text-on-surface-variant font-bold shadow-sm">
                <input className="hidden peer" name="pay_method" type="radio" value={2} checked={paymentMethod === 2} onChange={() => setPaymentMethod(2)} />
                <span className="material-symbols-outlined mr-1 text-[16px]">credit_card</span>
                <span className="text-[10px] uppercase tracking-widest">Tarjeta</span>
              </label>
              <label className="flex-1 flex items-center justify-center py-2 px-1 rounded-lg bg-surface cursor-pointer border border-outline-variant/50 transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white text-on-surface-variant font-bold shadow-sm">
                <input className="hidden peer" name="pay_method" type="radio" value={3} checked={paymentMethod === 3} onChange={() => setPaymentMethod(3)} />
                <span className="material-symbols-outlined mr-1 text-[16px]">account_balance</span>
                <span className="text-[10px] uppercase tracking-widest">Transf.</span>
              </label>
            </div>
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
            Agendar Pedido
          </button>
        </div>
      </form>
    </div>
  );
}
