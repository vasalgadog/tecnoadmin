import * as React from 'react';
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { formatCLP, parseCLP } from '../utils/formatters';

const navItems = [
  { path: '/', icon: 'grid_view', label: 'Inicio' },
  { path: '/pedidos', icon: 'receipt_long', label: 'Ver Pedidos' },
  { path: '/produccion', icon: 'bakery_dining', label: 'Cantidad de Pan', hidden: true },
  { path: '/verCajas', icon: 'payments', label: 'Ver Cajas', hidden: true },
  { path: '/productos', icon: 'inventory_2', label: 'Productos' },
  { path: '/tecnocard', icon: 'credit_card', label: 'Tecnocard' }
];

const getRouteTitle = (pathname: string) => {
  if (pathname === '/') return 'Resumen del Dashboard';
  if (pathname.startsWith('/pedidos')) return 'Ver Pedidos';
  if (pathname.startsWith('/produccion')) return 'Inventario de Cantidad de Pan';
  if (pathname.startsWith('/verCajas')) return 'Gestión de Cajas';
  if (pathname.startsWith('/productos')) return 'Inventario de Productos';
  if (pathname.startsWith('/tecnocard')) return 'Tarjetas Tecnocard';
  return 'Tecnopan';
};

export default function DashboardLayout() {
  const location = useLocation();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  // Sidebar responsive state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
  
  // Till state
  const [isTillOpen, setIsTillOpen] = useState(false);
  const [isOpenTillModalOpen, setIsOpenTillModalOpen] = useState(false);
  const [isCloseTillModalOpen, setIsCloseTillModalOpen] = useState(false);

  // Financial Formatting State
  const [expenseAmount, setExpenseAmount] = useState('');
  const [openTillAmount, setOpenTillAmount] = useState('');
  const [closeBilletes, setCloseBilletes] = useState('');
  const [closeMonedas, setCloseMonedas] = useState('');
  const [closeVouchers, setCloseVouchers] = useState('');
  const [closeOtros, setCloseOtros] = useState('');

  const handleCLPChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = parseCLP(raw);
    setter(raw.length > 0 ? formatCLP(numeric) : '');
  };

  const handleTillAction = () => {
    if (isTillOpen) {
      setIsCloseTillModalOpen(true);
    } else {
      setIsOpenTillModalOpen(true);
    }
  };

  const submitOpenTill = () => {
    setIsTillOpen(true);
    setIsOpenTillModalOpen(false);
  };

  const submitCloseTill = () => {
    setIsTillOpen(false);
    setIsCloseTillModalOpen(false);
  };

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-body relative lg:static">
      
      {/* Mobile Backdrop overlay */}
      {isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 z-[45] max-[499px]:block hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarExpanded(false)} 
        />
      )}

      {/* SideNavBar */}
      <aside className={`h-screen fixed left-0 top-0 bg-[#f4f4f1] border-r border-[#d9c2b8]/20 flex flex-col py-6 z-50 transition-all duration-300 ease-in-out transform max-[499px]:-translate-x-full max-[499px]:w-64 min-[500px]:translate-x-0 min-[500px]:w-20 xl:w-64 ${isSidebarExpanded ? '!translate-x-0 !w-64' : ''}`}>
        <div className={`mb-10 flex items-center px-0 xl:px-6 justify-center xl:justify-start max-[499px]:px-6 max-[499px]:justify-start ${isSidebarExpanded ? '!px-6 !justify-start' : ''}`}>
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left max-[499px]:items-start max-[499px]:text-left">
            <h1 className={`text-2xl font-bold text-[#703210] font-headline tracking-tight hidden xl:block max-[499px]:block ${isSidebarExpanded ? '!block' : ''}`}>Tecnopan</h1>
            <p className={`text-xs font-semibold text-stone-500 font-label uppercase tracking-widest mt-1 hidden xl:block max-[499px]:block ${isSidebarExpanded ? '!block' : ''}`}>Gestión Artesanal</p>
            {/* Icon-only fallback when collapsed */}
            <span className={`material-symbols-outlined text-3xl text-[#703210] block xl:hidden max-[499px]:hidden ${isSidebarExpanded ? '!hidden' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto w-full mt-2">
          {navItems.filter(item => !item.hidden).map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const baseClasses = "flex items-center py-3 transition-colors duration-200 group active:scale-[0.98]";
            const activeClasses = isActive ? "bg-[#ffdbcc] text-[#703210] font-bold" : "text-stone-600 hover:text-[#703210] hover:bg-[#f9f9f6]";
            const layoutClasses = "justify-center xl:px-6 xl:justify-start xl:rounded-r-full xl:mr-4 max-[499px]:px-6 max-[499px]:justify-start max-[499px]:rounded-r-full max-[499px]:mr-4";
            
            return (
              <div key={item.path} className={`xl:pr-4 max-[499px]:pr-4 ${isSidebarExpanded ? '!pr-4' : ''}`}>
                <Link 
                  to={item.path} 
                  onClick={() => setIsSidebarExpanded(false)}
                  className={`${baseClasses} ${activeClasses} ${layoutClasses} ${isSidebarExpanded ? '!px-6 !justify-start !rounded-r-full !mr-4' : ''}`} 
                  title={item.label}
                >
                  <span className={`material-symbols-outlined mr-0 xl:mr-3 max-[499px]:mr-3 ${isSidebarExpanded ? '!mr-3' : ''}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                  <span className={`text-sm font-label uppercase tracking-wide truncate hidden xl:block max-[499px]:block ${isSidebarExpanded ? '!block' : ''}`}>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>
        
        <div className={`mt-auto pt-4 border-t border-outline-variant/10 px-2 xl:px-6 max-[499px]:px-6 ${isSidebarExpanded ? '!px-6' : ''}`}>
          <button className={`flex items-center py-3 text-stone-600 hover:text-[#703210] hover:bg-[#f9f9f6] transition-colors duration-200 rounded-lg justify-center w-full xl:justify-start xl:px-4 max-[499px]:justify-start max-[499px]:px-4 ${isSidebarExpanded ? '!w-full !justify-start !px-4' : ''}`} title="Cerrar Sesión">
            <span className={`material-symbols-outlined mr-0 xl:mr-3 max-[499px]:mr-3 ${isSidebarExpanded ? '!mr-3' : ''}`}>logout</span>
            <span className={`text-sm font-label uppercase tracking-wide hidden xl:block max-[499px]:block ${isSidebarExpanded ? '!block' : ''}`}>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen relative flex flex-col overflow-hidden transition-all duration-300 ease-in-out max-[499px]:ml-0 min-[500px]:ml-20 xl:ml-64 ${isSidebarExpanded ? 'min-[500px]:!ml-64' : ''}`}>
        <header className={`fixed top-0 right-0 h-16 bg-[#f9f9f6]/95 backdrop-blur-md flex justify-between items-center px-4 md:px-8 z-40 border-b border-surface-container-high transition-all duration-300 ease-in-out max-[499px]:w-full min-[500px]:w-[calc(100%-5rem)] xl:w-[calc(100%-16rem)] ${isSidebarExpanded ? 'min-[500px]:!w-[calc(100%-16rem)]' : ''}`}>
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle */}
            <button onClick={toggleSidebar} className="p-2 rounded-lg text-stone-500 hover:text-primary hover:bg-surface-container-high transition-colors xl:hidden flex items-center justify-center">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg md:text-xl font-headline font-semibold text-[#703210] hidden sm:block">{getRouteTitle(location.pathname)}</h2>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Till Switch Button (Oculto según Paso 1.1) */}
            <button 
              style={{ display: 'none' }}
              onClick={handleTillAction} 
              className={`px-3 md:px-5 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-all flex items-center ${isTillOpen ? 'bg-secondary-fixed-dim text-on-secondary-fixed' : 'bg-surface-container-highest text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-sm mr-0 md:mr-2">{isTillOpen ? 'lock' : 'lock_open_right'}</span>
              <span className="hidden md:inline">{isTillOpen ? 'Cerrar Caja' : 'Abrir Caja'}</span>
            </button>

            {/* Register Expense Button (Oculto según Paso 1.1) */}
            <button 
              style={{ display: 'none' }}
              onClick={() => setIsExpenseModalOpen(true)} 
              className="bg-primary text-white px-3 md:px-5 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-90 transition-opacity flex items-center"
            >
              <span className="material-symbols-outlined text-sm mr-0 md:mr-2">add_circle</span>
              <span className="hidden md:inline">Gasto</span>
            </button>

            <div className="flex items-center space-x-2 md:space-x-4 text-stone-500">
              <button className="material-symbols-outlined hover:text-primary transition-colors p-1">notifications</button>
              <button className="material-symbols-outlined hover:text-primary transition-colors p-1">settings</button>
            </div>
          </div>
        </header>

        {/* Global Modals */}

        {/* Expense Modal */}
        {isExpenseModalOpen && (
          <div className="fixed inset-0 bg-[#1a1c1b]/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-extrabold text-primary">Registrar Gasto</h2>
                <button className="material-symbols-outlined text-outline hover:text-on-surface" onClick={() => setIsExpenseModalOpen(false)}>close</button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setIsExpenseModalOpen(false); }} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Valor *</label>
                  <div className="relative">
                    <input required value={expenseAmount} onChange={handleCLPChange(setExpenseAmount)} className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-lg font-bold py-4 pl-4" placeholder="$ 0" type="text" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Descripción *</label>
                  <textarea required className="w-full bg-surface-container-highest border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 resize-none" placeholder="Explique el gasto..." rows={3}></textarea>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity">Guardar Gasto</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Open Till Modal */}
        {isOpenTillModalOpen && (
          <div className="fixed inset-0 bg-[#1a1c1b]/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-headline font-extrabold text-primary">Abrir Caja</h2>
                <button className="material-symbols-outlined text-outline hover:text-on-surface" onClick={() => setIsOpenTillModalOpen(false)}>close</button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); submitOpenTill(); }} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1">Efectivo Inicial *</label>
                  <div className="relative">
                    <input required autoFocus value={openTillAmount} onChange={handleCLPChange(setOpenTillAmount)} className="w-full bg-surface-container-highest border-b-2 border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-lg font-bold py-4 pl-4" placeholder="$ 0" type="text" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined mr-2 text-sm">lock_open</span> Abrir Caja
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Close Till Modal */}
        {isCloseTillModalOpen && (
          <div className="fixed inset-0 bg-[#1a1c1b]/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-surface w-full max-w-4xl rounded-2xl shadow-[0_24px_48px_rgba(115,53,18,0.12)] p-8 border border-outline-variant/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/20">
                <div>
                  <h2 className="text-2xl font-headline font-extrabold text-primary">Cerrar Caja — Estación 01</h2>
                  <p className="text-sm font-label text-outline mt-1 uppercase tracking-widest font-bold">Declaraciones de Fin de Turno</p>
                </div>
                <button className="material-symbols-outlined text-outline hover:text-on-surface" onClick={() => setIsCloseTillModalOpen(false)}>close</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Station Summary */}
                <div className="lg:col-span-5 bg-surface-container-highest/30 rounded-xl p-6 border border-outline-variant/20">
                  <h3 className="text-sm font-headline font-bold text-on-surface mb-6 uppercase tracking-wider border-b border-outline-variant/10 pb-4">Resumen de Actividad</h3>
                  
                  <div className="mb-6 bg-surface-container-lowest p-4 rounded-lg shadow-sm">
                    <p className="text-[10px] font-label uppercase tracking-widest text-outline mb-1 font-bold">Ventas del Turno</p>
                    <h4 className="text-3xl font-headline font-extrabold text-primary-container">$450.000</h4>
                  </div>
                  
                  <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm">
                    <p className="text-[10px] font-label uppercase tracking-widest text-outline mb-1 font-bold">Gastos (Retiros)</p>
                    <h4 className="text-2xl font-headline font-extrabold text-error">$12.500</h4>
                  </div>
                </div>

                {/* Form Input Container */}
                <form onSubmit={(e) => { e.preventDefault(); submitCloseTill(); }} className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/20 shadow-sm">
                  <p className="text-sm text-outline mb-8 leading-relaxed">
                    Ingrese los montos físicos contados al finalizar el turno. Al guardar se generará un comprobante digital y se cerrará la sesión actual.
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Efectivo (Billetes) *</label>
                      <input required value={closeBilletes} onChange={handleCLPChange(setCloseBilletes)} className="w-full bg-surface-container-high border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 pl-3 transition-colors font-bold text-on-surface" placeholder="$ 0" type="text" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Efectivo (Monedas) *</label>
                      <input required value={closeMonedas} onChange={handleCLPChange(setCloseMonedas)} className="w-full bg-surface-container-high border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 pl-3 transition-colors font-bold text-on-surface" placeholder="$ 0" type="text" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Vouchers (Transbank) *</label>
                      <input required value={closeVouchers} onChange={handleCLPChange(setCloseVouchers)} className="w-full bg-surface-container-high border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 pl-3 transition-colors font-bold text-on-surface" placeholder="$ 0" type="text" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-label uppercase tracking-wider text-outline px-1 font-bold">Otros Medios *</label>
                      <input required value={closeOtros} onChange={handleCLPChange(setCloseOtros)} className="w-full bg-surface-container-high border-b-2 border-transparent focus:border-primary border-t-0 border-x-0 rounded-t-sm focus:ring-0 text-sm py-3 pl-3 transition-colors font-bold text-on-surface" placeholder="$ 0" type="text" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 border-t border-outline-variant/10 pt-6">
                    <button type="button" onClick={() => setIsCloseTillModalOpen(false)} className="px-6 py-3 text-sm font-bold text-outline hover:bg-surface-container-low rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" className="px-6 py-3 text-sm font-bold bg-error text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity">Aprobar y Cerrar Caja</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Container (scrolls independently) */}
        <div className="pt-16 flex-1 h-[calc(100vh-64px)] w-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
