/** Painel administrativo: login, CRUD de produtos e upload de fotos */
import { useState, useEffect } from 'react'
import {
  collection, getDocs, doc, updateDoc,
  writeBatch, addDoc
} from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../lib/firebase'
import { cloudinaryUrl } from '../lib/products'
import type { Product } from '../types/product'
import {
  Trash2, GripVertical, Save, Eye, EyeOff,
  Package, Star, Plus, Pencil, X, LogOut, Upload, RotateCcw
} from 'lucide-react'

const CLOUDINARY_CLOUD = 'dmd3guxrq'
const CLOUDINARY_PRESET = 'emcanto_produtos'

const EMPTY_FORM: Partial<Product> = {
  name: '', category: 'bolsas', description: '',
  basePrice: 0, image: '', active: true, isReadyToShip: false,
}

export default function Admin() {
  const [user, setUser]           = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [authError, setAuthError] = useState('')

  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [dragIdx, setDragIdx]     = useState<number | null>(null)
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null)

  const [showForm, setShowForm]         = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm]                 = useState<Partial<Product>>(EMPTY_FORM)
  const [uploading, setUploading]       = useState(false)
  const [showTrash, setShowTrash]       = useState(false)

  // Auth state
  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setAuthLoading(false)
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const map: Record<string, string> = {
        'auth/user-not-found':    'Usuário não encontrado.',
        'auth/wrong-password':    'Senha incorreta.',
        'auth/invalid-credential':'Email ou senha inválidos.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde.',
      }
      setAuthError(map[err.code] ?? 'Erro ao entrar. Tente novamente.')
    }
  }

  const handleLogout = () => signOut(auth)

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

  useEffect(() => { if (user) load() }, [user])

  const saveOrder = async () => {
    setSaving(true)
    const batch = writeBatch(db)
    products.forEach((p, i) => {
      batch.update(doc(db, 'products', p.id!), { order: i })
    })
    try {
      await batch.commit()
      showToast('Ordem salva!')
    } catch {
      showToast('Erro ao salvar ordem', false)
    }
    setSaving(false)
  }

  const toggleFeatured = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation()
    const batch = writeBatch(db)
    products.forEach(x => {
      if (x.isFeatured) batch.update(doc(db, 'products', x.id!), { isFeatured: false })
    })
    if (!p.isFeatured) batch.update(doc(db, 'products', p.id!), { isFeatured: true })
    await batch.commit()
    setProducts(prev => prev.map(x => ({ ...x, isFeatured: !p.isFeatured && x.id === p.id })))
    showToast(p.isFeatured ? 'Destaque removido' : `"${p.name}" em destaque na home!`)
  }

  const toggleActive = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation()
    await updateDoc(doc(db, 'products', p.id!), { active: !p.active })
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x))
    showToast(p.active ? 'Produto ocultado do catálogo' : 'Produto visível no catálogo')
  }

  const deleteProduct = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation()
    if (!confirm(`Mover "${p.name}" para a lixeira?`)) return
    await updateDoc(doc(db, 'products', p.id!), { active: false, deletedAt: new Date().toISOString() })
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: false, deletedAt: new Date().toISOString() } : x))
    showToast('Produto movido para a lixeira')
  }

  const restoreProduct = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation()
    await updateDoc(doc(db, 'products', p.id!), { active: true, deletedAt: null })
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, active: true, deletedAt: undefined } : x))
    showToast(`"${p.name}" restaurado!`)
  }

  const openAdd = () => {
    setEditingProduct(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation()
    setEditingProduct(p)
    setForm({ ...p })
    setShowForm(true)
  }

  const closeForm = () => { setShowForm(false); setEditingProduct(null); setForm(EMPTY_FORM) }

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY_PRESET)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST', body: fd,
      })
      const data = await res.json()
      return data.secure_url ?? ''
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    setForm(f => ({ ...f, image: url }))
  }

  const addPhoto = () => {
    setForm(f => ({ ...f, photos: [...(f.photos ?? []), { url: '', color: '', thread: '', description: '' }] }))
  }

  const removePhoto = (i: number) => {
    setForm(f => ({ ...f, photos: (f.photos ?? []).filter((_, idx) => idx !== i) }))
  }

  const updatePhoto = (i: number, field: string, value: string) => {
    setForm(f => {
      const photos = [...(f.photos ?? [])]
      const parsed = field === 'isReadyToShip' ? value === 'true'
                   : field === 'priceAdjust'   ? parseFloat(value) || 0
                   : value
      photos[i] = { ...photos[i], [field]: parsed }
      return { ...f, photos }
    })
  }

  const uploadPhotoImage = async (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    updatePhoto(i, 'url', url)
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const isReadyToShip = (form.photos ?? []).some(p => p.isReadyToShip)
      const basePrice = parseFloat(String(form.basePrice ?? '0').replace(',', '.')) || 0
      const photos = (form.photos ?? []).map(p => ({
        ...p,
        priceAdjust: parseFloat(String(p.priceAdjust ?? '0').replace(',', '.')) || 0
      }))
      const data = { ...form, basePrice, photos, isReadyToShip }
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id!), data)
        showToast('Produto atualizado!')
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          order: products.length,
          isFeatured: false,
        })
        showToast('Produto adicionado!')
      }
      closeForm()
      await load()
    } catch {
      showToast('Erro ao salvar produto', false)
    }
    setSaving(false)
  }

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

  // Loading auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-border p-10 w-full max-w-sm shadow-sm">
          <div className="text-center mb-8">
            <img src="/images/logo_fundo_transparente.png" alt="Em Canto Artesanato" className="w-20 h-20 object-contain mx-auto mb-4" />
            <h1 className="font-sans font-800 text-xl text-blue-900 tracking-widest lowercase">painel admin</h1>
            <p className="font-sans text-sm text-muted mt-1">Em Canto Artesanato</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-green"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-green"
                placeholder="••••••••"
                required
              />
            </div>
            {authError && (
              <p className="font-sans text-sm text-red-500 text-center">{authError}</p>
            )}
            <button
              type="submit"
              className="bg-blue-900 text-white py-3 rounded-xl font-sans text-sm font-700 tracking-wider hover:bg-blue-800 transition-colors mt-2"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-cream to-white border-b border-border">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div>
            <p className="font-sans text-xs text-green tracking-[0.2em] uppercase mb-2">Gestão</p>
            <h1 className="font-sans font-800 text-4xl text-blue-900 tracking-widest lowercase">painel admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted hover:text-ink font-sans text-sm transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </section>

      <div className="min-h-screen bg-cream py-12">
        <div className="max-w-6xl mx-auto px-6">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-green text-white px-5 py-2.5 rounded-xl font-sans text-sm font-600 hover:bg-green-dark transition-colors"
            >
              <Plus size={16} /> Novo Produto
            </button>
            <button
              onClick={saveOrder}
              disabled={saving}
              className="flex items-center gap-2 bg-white border border-border text-ink px-5 py-2.5 rounded-xl font-sans text-sm font-600 hover:bg-cream disabled:opacity-50 transition-colors"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar Ordem'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: products.filter(p => !p.deletedAt).length },
              { label: 'Ativos', value: products.filter(p => p.active && !p.deletedAt).length },
              { label: 'Pronta entrega', value: products.filter(p => p.isReadyToShip && !p.deletedAt).length },
              { label: 'Lixeira', value: products.filter(p => p.deletedAt).length },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-border text-center">
                <p className="font-serif text-3xl font-700 text-green">{s.value}</p>
                <p className="font-sans text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-4 px-1">
            <div className="flex items-center gap-1.5 font-sans text-xs text-muted">
              <Star size={13} className="text-yellow-500" fill="currentColor" /> Destaque na home
            </div>
            <div className="flex items-center gap-1.5 font-sans text-xs text-muted">
              <Eye size={13} className="text-green" /> Visível / <EyeOff size={13} /> Oculto no catálogo
            </div>
            <div className="flex items-center gap-1.5 font-sans text-xs text-muted">
              <Pencil size={13} /> Editar
            </div>
            <div className="flex items-center gap-1.5 font-sans text-xs text-muted">
              <GripVertical size={13} /> Arrastar para reordenar
            </div>
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
                <h2 className="font-sans text-sm font-600 text-ink">Produtos ({products.filter(p => !p.deletedAt).length})</h2>
              </div>
              <div className="divide-y divide-border">
                {products.filter(p => !p.deletedAt).map((p, i) => (
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
                    <div className="cursor-grab text-muted flex-shrink-0">
                      <GripVertical size={18} />
                    </div>
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                      {thumb(p) && <img src={thumb(p)} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-600 text-ink truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-sans text-xs text-muted capitalize">{p.category}</span>
                        {p.isReadyToShip && (
                          <span className="font-sans text-xs bg-green/10 text-green px-2 py-0.5 rounded-full">Pronta Entrega</span>
                        )}
                        {p.isFeatured && (
                          <span className="font-sans text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">Destaque</span>
                        )}
                      </div>
                    </div>
                    <p className="font-sans text-sm font-600 text-ink hidden sm:block flex-shrink-0">
                      {p.basePrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <div
                      className="flex items-center gap-1 flex-shrink-0"
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <button onClick={e => toggleFeatured(e, p)} title={p.isFeatured ? 'Remover destaque' : 'Destacar na home'}
                        className={`p-2 rounded-lg transition-colors ${p.isFeatured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-muted hover:bg-border'}`}>
                        <Star size={16} fill={p.isFeatured ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={e => toggleActive(e, p)} title={p.active ? 'Ocultar do catálogo' : 'Mostrar no catálogo'}
                        className={`p-2 rounded-lg transition-colors ${p.active ? 'text-green hover:bg-green/10' : 'text-muted hover:bg-border'}`}>
                        {p.active ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={e => openEdit(e, p)} title="Editar produto"
                        className="p-2 rounded-lg text-muted hover:text-blue-900 hover:bg-blue-50 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={e => deleteProduct(e, p)} title="Excluir produto"
                        className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trash */}
          {!loading && products.some(p => p.deletedAt) && (
            <div className="mt-6">
              <button
                onClick={() => setShowTrash(v => !v)}
                className="flex items-center gap-2 font-sans text-sm text-muted hover:text-ink transition-colors mb-3"
              >
                <Trash2 size={15} />
                Lixeira ({products.filter(p => p.deletedAt).length})
                <span className="text-xs">{showTrash ? '▲ ocultar' : '▼ mostrar'}</span>
              </button>
              {showTrash && (
                <div className="bg-white rounded-2xl border border-red-100 overflow-hidden opacity-75">
                  <div className="divide-y divide-border">
                    {products.filter(p => p.deletedAt).map(p => (
                      <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                          {thumb(p) && <img src={thumb(p)} alt={p.name} className="w-full h-full object-cover grayscale" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-600 text-muted truncate line-through">{p.name}</p>
                          <p className="font-sans text-xs text-muted mt-0.5">
                            Excluído em {p.deletedAt ? new Date(p.deletedAt).toLocaleDateString('pt-BR') : '—'}
                          </p>
                        </div>
                        <button
                          onClick={e => restoreProduct(e, p)}
                          title="Restaurar produto"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-green hover:bg-green/10 font-sans text-xs font-600 transition-colors flex-shrink-0"
                        >
                          <RotateCcw size={14} /> Restaurar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-sans font-700 text-ink">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={closeForm} className="p-2 text-muted hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveProduct} className="p-6 flex flex-col gap-4">
              <div>
                <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Nome *</label>
                <input type="text" required value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-green" />
              </div>
              <div>
                <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Categoria *</label>
                <select required value={form.category ?? 'bolsas'} onChange={e => setForm(f => ({ ...f, category: e.target.value as Product['category'] }))}
                  className="w-full border border-border rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-green">
                  <option value="bolsas">Bolsas</option>
                  <option value="colares">Colares</option>
                  <option value="centros-de-mesa">Mesa Posta</option>
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Descrição</label>
                <textarea rows={3} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-green resize-none" />
              </div>
              <div>
                <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Preço base (R$) *</label>
                <input type="text" required
                  value={form.basePrice ?? ''}
                  onChange={e => setForm(f => ({ ...f, basePrice: e.target.value as any }))}
                  placeholder="150,00"
                  className="w-full border border-border rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-green" />
              </div>
              <div>
                <label className="font-sans text-xs text-muted uppercase tracking-wider mb-1 block">Foto principal</label>
                {form.image && (
                  <img src={cloudinaryUrl(form.image, 120, 120)} alt="" className="w-20 h-20 object-cover rounded-xl mb-2" />
                )}
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-xl px-4 py-3 hover:border-green transition-colors">
                  <Upload size={16} className="text-muted" />
                  <span className="font-sans text-sm text-muted">{uploading ? 'Enviando...' : 'Escolher imagem'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {/* Photos with Cor + Fio */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-sans text-xs text-muted uppercase tracking-wider">Fotos — Cor e Fio</label>
                  <button type="button" onClick={addPhoto}
                    className="flex items-center gap-1 font-sans text-xs text-green hover:text-green-dark font-600">
                    <Plus size={14} /> Adicionar foto
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {(form.photos ?? []).map((photo, i) => (
                    <div key={i} className="border border-border rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        {photo.url && (
                          <img src={cloudinaryUrl(photo.url, 80, 80)} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                        )}
                        <label className="flex-1 flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg px-3 py-2 hover:border-green transition-colors">
                          <Upload size={14} className="text-muted flex-shrink-0" />
                          <span className="font-sans text-xs text-muted">{uploading ? 'Enviando...' : photo.url ? 'Trocar imagem' : 'Escolher imagem'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={e => uploadPhotoImage(e, i)} disabled={uploading} />
                        </label>
                        <button type="button" onClick={() => removePhoto(i)} className="text-muted hover:text-red-500 transition-colors flex-shrink-0">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-sans text-xs text-muted mb-1 block">Cor</label>
                          <input type="text" value={photo.color ?? ''} onChange={e => updatePhoto(i, 'color', e.target.value)}
                            placeholder="ex: preta" className="w-full border border-border rounded-lg px-3 py-2 font-sans text-sm focus:outline-none focus:border-green" />
                        </div>
                        <div>
                          <label className="font-sans text-xs text-muted mb-1 block">Fio</label>
                          <input type="text" value={photo.thread ?? ''} onChange={e => updatePhoto(i, 'thread', e.target.value)}
                            placeholder="ex: ráfia" className="w-full border border-border rounded-lg px-3 py-2 font-sans text-sm focus:outline-none focus:border-green" />
                        </div>
                        <div className="col-span-2">
                          <label className="font-sans text-xs text-muted mb-1 block">Descritivo da peça</label>
                          <input type="text" value={photo.description ?? ''} onChange={e => updatePhoto(i, 'description', e.target.value)}
                            placeholder="ex: design moderno, acabamento refinado" className="w-full border border-border rounded-lg px-3 py-2 font-sans text-sm focus:outline-none focus:border-green" />
                        </div>
                        <div>
                          <label className="font-sans text-xs text-muted mb-1 block">Diferença de preço (R$)</label>
                          <input type="text"
                            value={photo.priceAdjust ?? ''}
                            onChange={e => {
                              const val = e.target.value.replace(',', '.')
                              const parsed = parseFloat(val) || 0
                              updatePhoto(i, 'priceAdjust', String(parsed))
                            }}
                            placeholder="0,00"
                            className="w-full border border-border rounded-lg px-3 py-2 font-sans text-sm focus:outline-none focus:border-green" />
                          <p className="font-sans text-xs text-muted mt-0.5">0 = mesmo preço · positivo = acréscimo</p>
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                          <input type="checkbox" id={`ship-${i}`} checked={photo.isReadyToShip ?? false}
                            onChange={e => updatePhoto(i, 'isReadyToShip', String(e.target.checked))}
                            className="w-4 h-4 accent-green" />
                          <label htmlFor={`ship-${i}`} className="font-sans text-sm text-ink cursor-pointer">Pronta entrega</label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(form.photos ?? []).length === 0 && (
                    <p className="font-sans text-xs text-muted text-center py-3 border border-dashed border-border rounded-xl">
                      Nenhuma foto adicionada. Clique em "Adicionar foto" para incluir variações.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active ?? true} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                    className="w-4 h-4 accent-green" />
                  <span className="font-sans text-sm text-ink">Visível no catálogo</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm}
                  className="flex-1 border border-border text-ink py-3 rounded-xl font-sans text-sm font-600 hover:bg-cream transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving || uploading}
                  className="flex-1 bg-green text-white py-3 rounded-xl font-sans text-sm font-700 hover:bg-green-dark disabled:opacity-50 transition-colors">
                  {saving ? 'Salvando...' : editingProduct ? 'Salvar alterações' : 'Adicionar produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-sans text-sm font-600 text-white shadow-lg z-50 ${
          toast.ok ? 'bg-green' : 'bg-red-500'
        }`}>
          {toast.msg}
        </div>
      )}
    </>
  )
}
