import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Bolsas from './pages/Bolsas'
import Colares from './pages/Colares'
import MesaPosta from './pages/MesaPosta'
import ProntaEntrega from './pages/ProntaEntrega'
import Rastreio from './pages/Rastreio'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter basename="/emcantoartesanato">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/bolsas"         element={<Bolsas />} />
            <Route path="/colares"        element={<Colares />} />
            <Route path="/mesa-posta"     element={<MesaPosta />} />
            <Route path="/pronta-entrega" element={<ProntaEntrega />} />
            <Route path="/rastreio"       element={<Rastreio />} />
            <Route path="/admin"          element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  )
}
