export default function OrderRegistration() {
  return (
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
  );
}
