import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { cloudinaryUrl } from '../lib/products'
import type { Product } from '../types/product'
import { Trash2, GripVertical, Save, Eye, EyeOff, Package } from 'lucide-react'

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'products'))
    const all = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Product))
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    setProducts(all)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const saveOrder = async () => {
    setSaving(true)
    const batch = writeBatch(db)
    products.forEach((p, i) => {
      batch.update(doc(db, 'products', p.id!), { order: i })
    })
    try {
      await batch.commit()
      showToast('Ordem salva com sucesso!')
    } catch {
      showToast('Erro ao salvar ordem', false)
    }
    setSaving(false)
  }

  const toggleActive = async (p: Product) => {
    await updateDoc(doc(db, 'products', p.id!), { active: !p.active })
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
    showToast(p.active ? 'Produto ocultado' : 'Produto ativado')
  }

  const deleteProduct = async (p: Product) => {
    if (!confirm(`Excluir "${p.name}"?`)) return
    await deleteDoc(doc(db, 'products', p.id!))
    setProducts(prev => prev.filter(x => x.id !== p.id))
    showToast('Produto excluído')
  }

  // Drag and drop
  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    setProducts(prev => {
      const arr = [...prev]
      const [moved] = arr.splice(dragIdx, 1)
      arr.splice(i, 0, moved)
      return arr
    })
    setDragIdx(i)
  }
  const onDragEnd = () => { setDragIdx(null); saveOrder() }

  const thumb = (p: Product) => {
    const photos = (p.photos || []).filter(ph => ph.url)
    const url = photos.length > 0 ? photos[0].url : p.image
    return url ? cloudinaryUrl(url, 80, 80) : ''
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-sans text-xs text-green tracking-[0.2em] uppercase mb-1">Gestão</p>
            <h1 className="font-serif text-3xl font-700 text-ink">Painel Admin</h1>
          </div>
          <button
            onClick={saveOrder}
            disabled={saving}
            className="flex items-center gap-2 bg-green text-white px-5 py-2.5 rounded-xl font-sans text-sm font-600 hover:bg-green-dark disabled:opacity-50 transition-colors"
          >
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar Ordem'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total de produtos', value: products.length },
            { label: 'Ativos', value: products.filter(p => p.active).length },
            { label: 'Pronta entrega', value: products.filter(p => p.isReadyToShip).length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-border text-center">
              <p className="font-serif text-3xl font-700 text-green">{s.value}</p>
              <p className="font-sans text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Product list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Package size={18} className="text-green" />
              <h2 className="font-sans text-sm font-600 text-ink">Produtos ({products.length})</h2>
              <p className="font-sans text-xs text-muted ml-auto">Arraste para reordenar</p>
            </div>

            <div className="divide-y divide-border">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={e => onDragOver(e, i)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                    dragIdx === i ? 'bg-green/5' : 'hover:bg-cream/50'
                  } ${!p.active ? 'opacity-50' : ''}`}
                >
                  {/* Drag handle */}
                  <div className="cursor-grab text-muted">
                    <GripVertical size={18} />
                  </div>

                  {/* Thumb */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                    {thumb(p) && (
                      <img src={thumb(p)} alt={p.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-600 text-ink truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-sans text-xs text-muted capitalize">{p.category}</span>
                      {p.isReadyToShip && (
                        <span className="font-sans text-xs bg-green/10 text-green px-2 py-0.5 rounded-full">Pronta Entrega</span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <p className="font-sans text-sm font-600 text-ink hidden sm:block">
                    {p.basePrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`p-2 rounded-lg transition-colors ${p.active ? 'text-green hover:bg-green/10' : 'text-muted hover:bg-border'}`}
                      title={p.active ? 'Ocultar' : 'Ativar'}
                    >
                      {p.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => deleteProduct(p)}
                      className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-sans text-sm font-600 text-white shadow-lg transition-all ${
          toast.ok ? 'bg-green' : 'bg-red-500'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
