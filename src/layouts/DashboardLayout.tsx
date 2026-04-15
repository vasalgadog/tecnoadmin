import { Outlet, NavLink } from 'react-router-dom';
import { Home, Package, Box, Calendar, LogOut } from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar surface-container-high">
        <div className="sidebar-header">
          <h2 className="display-logo">Tecnopan</h2>
          <p className="subtitle">Bakery Management</p>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/Inicio" className="nav-item">
            <Home size={20} />
            <span>Inicio</span>
          </NavLink>
          <NavLink to="/cajas" className="nav-item">
            <Box size={20} />
            <span>Ver Cajas</span>
          </NavLink>
          <NavLink to="/produccion" className="nav-item">
            <Package size={20} />
            <span>Cantidad de Pan</span>
          </NavLink>
          <NavLink to="/pedidos" className="nav-item">
            <Calendar size={20} />
            <span>Ver Pedidos</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
           <NavLink to="/login" className="nav-item ghost-border">
             <LogOut size={20} />
             <span>Cerrar Sesión</span>
           </NavLink>
        </div>
      </aside>
      <main className="main-content surface">
        <header className="topbar surface-container-low">
          <div className="user-profile">Panel de Administración</div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
