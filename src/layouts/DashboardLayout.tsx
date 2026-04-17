import { Outlet, Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/inicio', icon: 'grid_view', label: 'Home' },
  { path: '/pedidos', icon: 'receipt_long', label: 'View Orders' },
  { path: '/cantidad-pan', icon: 'bakery_dining', label: 'View Bread Quantity' },
  { path: '/cajas', icon: 'payments', label: 'View Tills' },
  { path: '/cerrar-caja', icon: 'lock_clock', label: 'Close Till' }
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="bg-surface text-on-surface flex min-h-screen font-body">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#f4f4f1] border-r border-[#d9c2b8]/20 flex flex-col py-6 z-50">
        <div className="px-6 mb-10">
          <h1 className="text-2xl font-bold text-[#703210] font-headline tracking-tight">Tecnopan</h1>
          <p className="text-xs font-semibold text-stone-500 font-label uppercase tracking-widest mt-1">Artisanal Management</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            if (isActive) {
              return (
                <Link key={item.path} to={item.path} className="flex items-center px-6 py-3 bg-[#ffdbcc] text-[#703210] font-bold rounded-r-full transition-transform active:scale-[0.98]">
                  <span className="material-symbols-outlined mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  <span className="text-sm font-label uppercase tracking-wide">{item.label}</span>
                </Link>
              );
            }
            
            return (
              <Link key={item.path} to={item.path} className="flex items-center px-6 py-3 text-stone-600 hover:text-[#703210] hover:bg-[#f9f9f6] transition-colors duration-200 group active:scale-[0.98]">
                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                <span className="text-sm font-label uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="px-6 mt-auto">
          <button className="flex items-center w-full px-4 py-3 text-stone-600 hover:text-[#703210] hover:bg-[#f9f9f6] transition-colors duration-200 rounded-lg">
            <span className="material-symbols-outlined mr-3">logout</span>
            <span className="text-sm font-label uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen relative">
        <Outlet />
      </main>
    </div>
  );
}
