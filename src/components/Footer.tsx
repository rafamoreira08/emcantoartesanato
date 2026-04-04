import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-sans text-xs text-muted uppercase tracking-[0.2em]">Em Canto Artesanato</p>
          <p className="script text-green text-lg mt-0.5">by Sônia Lima</p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/emcantoartesanato"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted hover:text-ink transition-colors font-sans text-sm"
          >
            <Instagram size={16} />
            @emcantoartesanato
          </a>
          <a
            href={`https://wa.me/5531991236334?text=${encodeURIComponent('Olá Sônia!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-muted hover:text-ink transition-colors"
          >
            (31) 99123-6334
          </a>
        </div>

        <p className="font-sans text-xs text-muted/60">© 2026 Em Canto Artesanato</p>
      </div>
    </footer>
  )
}
