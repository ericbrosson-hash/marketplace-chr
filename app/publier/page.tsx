'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputStyle = {
  width: '100%',
  border: '1px solid var(--chr-border)',
  borderRadius: 'var(--chr-radius-sm)',
  padding: '8px 12px',
  fontSize: '14px',
  color: 'var(--chr-text)',
  background: 'var(--chr-card)',
  outline: 'none',
  fontFamily: 'inherit',
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '500' as const,
  color: 'var(--chr-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: '6px',
}

export default function Publier() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [form, setForm] = useState({
    titre: '',
    categorie: '',
    etat: '',
    prix: '',
    ville: '',
    description: '',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/connexion')
      } else {
        setUserId(user.id)
      }
    }
    getUser()
  }, [router])

const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || [])
  const newPhotos = [...photos, ...files].slice(0, 3)
  setPhotos(newPhotos)
  setPreviews(newPhotos.map(f => URL.createObjectURL(f)))
  // Reset l'input pour permettre de resélectionner le même fichier
  e.target.value = ''
}

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPreviews(newPreviews)
  }

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const photo of photos) {
      const ext = photo.name.split('.').pop()
      const filename = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('annonces-photos')
        .upload(filename, photo)
      if (!error) {
        const { data } = supabase.storage
          .from('annonces-photos')
          .getPublicUrl(filename)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const photoUrls = await uploadPhotos()

    const { error } = await supabase
      .from('annonces')
      .insert([{
        titre: form.titre,
        categorie: form.categorie,
        etat: form.etat,
        prix: Number(form.prix),
        ville: form.ville,
        description: form.description,
        vendeur_id: userId,
        photos: photoUrls,
      }])

    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      router.push('/annonces')
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--chr-bg)' }}>

      {/* Navbar */}
      <header style={{ background: 'var(--chr-navbar)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--chr-accent)' }}></span>
            <span className="text-sm font-semibold" style={{ color: 'var(--chr-text-inverse)' }}>CHR Occasion</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/annonces" className="text-sm" style={{ color: '#999' }}>Annonces</Link>
            <Link href="/estimer" className="text-sm" style={{ color: '#999' }}>Estimer</Link>
            <Link href="/messages" className="text-sm" style={{ color: '#999' }}>Messages</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--chr-text)' }}>
            Publier une annonce
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--chr-muted)' }}>
            Votre annonce sera visible par tous les professionnels CHR
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
          >

            {/* Photos */}
            <div>
            <label style={labelStyle}>Photos (3 max)</label>
            <div className="flex gap-3 mb-3">
                {previews.map((src, i) => (
                <div key={i} className="relative">
                    <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                    style={{ border: '1px solid var(--chr-border)' }}
                    />
                    <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                    style={{ background: '#1A1A1A', color: '#fff' }}
                    >
                    ×
                    </button>
                </div>
                ))}
                {previews.length < 3 && (
                <label
                    className="w-24 h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer text-xs gap-1"
                    style={{
                    border: '1px dashed var(--chr-border)',
                    background: 'var(--chr-bg)',
                    color: 'var(--chr-muted)',
                    }}
                >
                    <span style={{ fontSize: '20px' }}>+</span>
                    <span>Ajouter</span>
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotos}
                    />
                </label>
                )}
            </div>
            <p className="text-xs" style={{ color: 'var(--chr-muted)' }}>
                {previews.length}/3 photo{previews.length > 1 ? 's' : ''} — cliquez sur + pour ajouter une photo à la fois
            </p>
            </div>

            <div style={{ borderTop: '1px solid var(--chr-border)', paddingTop: '20px' }}>
              <label style={labelStyle}>Titre de l'annonce *</label>
              <input
                type="text"
                placeholder="Ex: Four Rational SCC61 occasion"
                style={inputStyle}
                value={form.titre}
                onChange={(e) => setForm({...form, titre: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Catégorie *</label>
                <select
                  style={inputStyle}
                  value={form.categorie}
                  onChange={(e) => setForm({...form, categorie: e.target.value})}
                  required
                >
                  <option value="">Choisir</option>
                  <option value="Cuisson">🔥 Cuisson</option>
                  <option value="Réfrigération">❄️ Réfrigération</option>
                  <option value="Laverie">🫧 Laverie</option>
                  <option value="Préparation">🔪 Préparation</option>
                  <option value="Mobilier">🪑 Mobilier</option>
                  <option value="Bar">🍺 Bar</option>
                  <option value="Caisse">💳 Caisse</option>
                  <option value="Autre">📦 Autre</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>État *</label>
                <select
                  style={inputStyle}
                  value={form.etat}
                  onChange={(e) => setForm({...form, etat: e.target.value})}
                  required
                >
                  <option value="">Choisir</option>
                  <option value="Neuf">Neuf</option>
                  <option value="Très bon état">Très bon état</option>
                  <option value="Bon état">Bon état</option>
                  <option value="Correct">Correct</option>
                  <option value="Pour pièces">Pour pièces</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Prix (€) *</label>
                <input
                  type="number"
                  placeholder="Ex: 2500"
                  style={inputStyle}
                  value={form.prix}
                  onChange={(e) => setForm({...form, prix: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Ville *</label>
                <input
                  type="text"
                  placeholder="Ex: Lyon"
                  style={inputStyle}
                  value={form.ville}
                  onChange={(e) => setForm({...form, ville: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                placeholder="Décrivez l'état, l'historique, les dimensions..."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--chr-border)', paddingTop: '20px' }}>
              <button
                type="submit"
                disabled={loading || !userId}
                className="w-full py-3 rounded-md text-sm font-semibold disabled:opacity-50"
                style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
              >
                {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  )
}