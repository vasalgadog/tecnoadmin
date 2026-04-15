import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';

import Login from './pages/Login';
import Inicio from './pages/Inicio';
import VerCajas from './pages/VerCajas';
import CerrarCaja from './pages/CerrarCaja';
import CantidadDePan from './pages/CantidadDePan';
import VerPedidos from './pages/VerPedidos';
import CalendarioPedidos from './pages/CalendarioPedidos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/Inicio" replace />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/cajas" element={<VerCajas />} />
          <Route path="/cajas/cerrar" element={<CerrarCaja />} />
          <Route path="/produccion" element={<CantidadDePan />} />
          <Route path="/pedidos" element={<VerPedidos />} />
          <Route path="/pedidos/calendario" element={<CalendarioPedidos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
