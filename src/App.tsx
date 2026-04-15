import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';

// Mock pages for now
const Login = () => <div className="p-8"><h1>Login</h1></div>;
const Inicio = () => <div className="p-8"><h1>Inicio</h1></div>;
const VerCajas = () => <div className="p-8"><h1>Ver Cajas</h1></div>;
const CerrarCaja = () => <div className="p-8"><h1>Cerrar Caja</h1></div>;
const CantidadDePan = () => <div className="p-8"><h1>Cantidad de Pan</h1></div>;
const VerPedidos = () => <div className="p-8"><h1>Ver Pedidos</h1></div>;
const CalendarioPedidos = () => <div className="p-8"><h1>Calendario de Pedidos</h1></div>;

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
