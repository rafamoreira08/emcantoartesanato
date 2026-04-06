interface Props {
  title: string
  subtitle?: string
  icon?: string
}

export default function CategoryHero({ title, subtitle, icon }: Props) {
  return (
    <section className="pt-20 pb-12 bg-gradient-to-b from-cream to-white border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-start gap-4">
          {icon && <div className="text-4xl">{icon}</div>}
          <div>
            <p className="font-sans text-sm font-600 text-green tracking-[0.2em] uppercase mb-2">Nosso Catálogo</p>
            <h1 className="font-sans font-800 text-4xl lg:text-5xl text-blue-900 tracking-widest lowercase mb-4">{title}</h1>
            {subtitle && <p className="font-sans text-lg text-muted leading-relaxed max-w-2xl">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
