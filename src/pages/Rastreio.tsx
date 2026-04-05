import { useState } from 'react'
import { Search, Package, ExternalLink } from 'lucide-react'

export default function Rastreio() {
  const [codigo, setCodigo] = useState('')

  const handleRastrear = () => {
    if (!codigo.trim()) return
    window.open(`https://rastreamento.correios.com.br/app/index.php?objeto=${codigo.trim()}`, '_blank')
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green/10 rounded-2xl mb-4">
            <Package size={32} className="text-green" />
          </div>
          <p className="font-sans text-sm text-green tracking-[0.2em] uppercase mb-2">Encomendas</p>
          <h1 className="font-serif text-4xl font-700 text-ink mb-3">
            Rastreio de <em className="text-green not-italic">Pedido</em>
          </h1>
          <p className="font-sans text-muted">
            Acompanhe sua encomenda em tempo real. Insira o código enviado por Sônia após a confirmação do pedido.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
          <label className="block font-sans text-sm font-600 text-ink mb-2">
            Código de rastreio
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleRastrear()}
              placeholder="Ex: AA123456789BR"
              className="flex-1 border border-border rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-green transition-colors uppercase tracking-widest"
            />
            <button
              onClick={handleRastrear}
              disabled={!codigo.trim()}
              className="flex items-center gap-2 bg-green text-white px-6 py-3 rounded-xl font-sans text-sm font-600 hover:bg-green-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Search size={16} />
              Rastrear
            </button>
          </div>
          <p className="font-sans text-xs text-muted mt-3 flex items-center gap-1">
            <ExternalLink size={12} />
            Você será redirecionado para o site dos Correios
          </p>
        </div>

        {/* Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-border">
            <p className="font-serif text-sm font-600 text-ink mb-1">Não tem o código?</p>
            <p className="font-sans text-xs text-muted leading-relaxed">
              Após o despacho, Sônia envia o código via WhatsApp. Verifique suas mensagens.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-border">
            <p className="font-serif text-sm font-600 text-ink mb-1">Precisa de ajuda?</p>
            <a
              href="https://wa.me/5531991236334?text=Olá Sônia! Preciso de ajuda com o rastreio do meu pedido."
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-green font-600 hover:underline"
            >
              Fale diretamente pelo WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
