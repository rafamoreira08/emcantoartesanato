/** Roteador principal com HashRouter para GitHub Pages */
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Bolsas from './pages/Bolsas'
import Colares from './pages/Colares'
import MesaPosta from './pages/MesaPosta'
import ProntaEntrega from './pages/ProntaEntrega'
import Rastreio from './pages/Rastreio'
import Admin from './pages/Admin'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/',               element: <Home /> },
      { path: '/bolsas',         element: <Bolsas /> },
      { path: '/colares',        element: <Colares /> },
      { path: '/mesa-posta',     element: <MesaPosta /> },
      { path: '/pronta-entrega', element: <ProntaEntrega /> },
      { path: '/rastreio',       element: <Rastreio /> },
      { path: '/admin',          element: <Admin /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
