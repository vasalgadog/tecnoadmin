import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import './App.css';

import Login from './pages/Login';
import Inicio from './pages/Inicio';
import VerCajas from './pages/VerCajas';
import CantidadDePan from './pages/CantidadDePan';
import VerPedidos from './pages/VerPedidos';
import Productos from './pages/Productos';
import Tecnocard from './pages/Tecnocard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/verCajas" element={<VerCajas />} />
          <Route path="/produccion" element={<CantidadDePan />} />
          <Route path="/pedidos" element={<VerPedidos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/tecnocard" element={<Tecnocard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
