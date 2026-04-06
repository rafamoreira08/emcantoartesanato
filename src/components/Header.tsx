import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const nav = [
  { label: 'Início',           to: '/' },
  { label: 'Bolsas',           to: '/bolsas' },
  { label: 'Colares',          to: '/colares' },
  { label: 'Mesa Posta',       to: '/mesa-posta' },
  { label: 'Pronta Entrega',   to: '/pronta-entrega' },
  { label: 'Rastreio',         to: '/rastreio' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 shrink-0" onClick={() => setOpen(false)}>
          <img src="/images/logo_fundo_transparente.png" alt="Em Canto Artesanato" className="h-14 w-14 object-contain" />
          <span className="leading-tight hidden sm:block">
            <span className="block font-sans font-800 text-blue-900 tracking-widest text-[0.9rem]">em canto</span>
            <span className="script text-blue-400 text-[1.1rem] -mt-1 block">artesanato</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 rounded-lg font-sans text-[0.875rem] font-500 transition-colors
                ${pathname === item.to
                  ? 'text-green font-600'
                  : 'text-muted hover:text-ink hover:bg-border/50'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={`https://wa.me/5531991236334?text=${encodeURIComponent('Olá Sônia! Vim pelo site e gostaria de fazer uma encomenda.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-green text-white px-4 py-2 rounded-full font-sans text-sm font-600 hover:bg-green-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.338-1.506A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.013-1.375l-.36-.214-3.732.886.935-3.617-.236-.373A9.783 9.783 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          Encomendar
        </a>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-ink" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-cream px-6 py-4 flex flex-col gap-1">
          {nav.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg font-sans text-sm font-500 transition-colors
                ${pathname === item.to ? 'text-green bg-green/5' : 'text-ink hover:bg-border/50'}`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/5531991236334?text=${encodeURIComponent('Olá Sônia! Vim pelo site e gostaria de fazer uma encomenda.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex justify-center items-center gap-2 bg-green text-white px-4 py-3 rounded-xl font-sans text-sm font-600"
          >
            Encomendar via WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
