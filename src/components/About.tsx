import { Heart } from 'lucide-react'

export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-sans text-sm font-500 text-green tracking-[0.2em] uppercase">
            Como começou
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl text-ink mt-2 font-700">
            Minha <em className="text-green not-italic">História</em>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-border/30 shadow-lg">
                <img
                  src="/images/sonia.jpg"
                  alt="Sônia Lima — Em Canto Artesanato"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-3xl text-ink font-700 leading-[1.2]">
              O amor que se<br />
              <em className="text-green not-italic script text-4xl">transforma em arte</em>
            </h3>

            <p className="font-sans text-lg text-muted leading-relaxed">
              Desde muito cedo, fui envolvida pelo encanto das linhas e das agulhas. Cresci observando minha avó paterna e minhas tias maternas transformarem fios delicados em peças que pareciam verdadeiras obras de arte. Era o crochê de antigamente — feito com linhas finas, paciência e um cuidado quase mágico — que resultava em trabalhos tão delicados que lembravam rendas.
            </p>

            <p className="font-sans text-lg text-muted leading-relaxed">
              Eu me encantava com aquele cenário: o movimento suave das mãos, a dança ritmada das agulhas e, pouco a pouco, o surgimento de algo único. Foi ali, entre memórias afetivas e momentos simples, que nasceu minha paixão pelo tricô e pelo crochê.
            </p>

            <p className="font-sans text-lg text-muted leading-relaxed">
              Hoje, cada peça que crio carrega um pouco dessa história. Mais do que produtos, são expressões de carinho, tradição e dedicação — um elo entre o passado e o presente, feito à mão com amor.
            </p>

            {/* Signature */}
            <div className="py-6">
              <p className="font-serif text-xl font-600 text-ink">
                Sônia Lima
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <p className="font-serif text-2xl font-700 text-green">100%</p>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Artesanal</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl font-700 text-green">
                  <Heart className="inline-block" size={24} fill="currentColor" />
                </p>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Feito com amor</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl font-700 text-green">Única</p>
                <p className="font-sans text-xs text-muted uppercase tracking-wider">Cada peça</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
