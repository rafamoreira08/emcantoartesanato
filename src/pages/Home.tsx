import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import About from '../components/About'
import { WHATSAPP } from '../lib/products'

export default function Home() {
  return (
    <>
      <Hero />

      {/* Category strips with descriptions */}
      <div className="border-t border-border" />
      <CategoryStrip
        category="bolsas"
        title="Bolsas Artesanais"
        description="Peças confeccionadas com cordões tecidos em crochê, elaborados com fios especiais, combinados a resinas, pedras e metais cuidadosamente selecionados. Com fechos metálicos e acabamento refinado, cada criação é única — marcada por personalidade, autenticidade e identidade própria."
        ctaLink="/bolsas"
        ctaLabel="Ver todas as bolsas"
      />

      <div className="border-t border-border" />
      <CategoryStrip
        category="colares"
        title="Colares e Chokers"
        description="Peças confeccionadas com cordões tecidos em crochê, elaborados com fios especiais, combinados a resinas, pedras e metais cuidadosamente selecionados. Com fechos metálicos e acabamento refinado, cada criação é única — marcada por personalidade, autenticidade e identidade própria."
        ctaLink="/colares"
        ctaLabel="Ver todos os colares"
      />

      <div className="border-t border-border" />
      <CategoryStrip
        category="centros-de-mesa"
        title="Mesa Posta"
        description="Em breve — descrição da coleção Mesa Posta será adicionada em breve."
        ctaLink="/mesa-posta"
        ctaLabel="Ver mesa posta completa"
      />

      {/* WhatsApp CTA */}
      <div className="border-t border-border bg-cream py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-700 text-ink mb-4">Pronto para sua encomenda?</h2>
          <p className="font-sans text-lg text-muted mb-6 max-w-md mx-auto">
            Entre em contato conosco via WhatsApp para discutir cores, tamanhos e personalizações
          </p>
          <a
            href={`${WHATSAPP}?text=${encodeURIComponent('Olá Sônia! Vim pelo site e gostaria de fazer uma encomenda.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green text-white px-8 py-4 rounded-full font-sans text-sm font-600 hover:bg-green-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            Encomendar via WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-border" />
      <About />
    </>
  )
}
