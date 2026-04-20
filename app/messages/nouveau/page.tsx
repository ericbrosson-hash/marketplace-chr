'use client'
import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function NouveauMessageForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vendeurId = searchParams.get('vendeur')
  const annonceId = searchParams.get('annonce')

  const [userId, setUserId] = useState<string | null>(null)
  const [annonce, setAnnonce] = useState<any>(null)
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/connexion'); return }
      setUserId(user.id)

      if (annonceId) {
        const { data } = await supabase
          .from('annonces')
          .select('titre, ville, prix')
          .eq('id', annonceId)
          .single()
        setAnnonce(data)
      }
    }
    init()
  }, [router, annonceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !vendeurId || !annonceId) return
    setLoading(true)

    const { error } = await supabase
      .from('messages')
      .insert([{
        annonce_id: annonceId,
        expediteur_id: userId,
        destinataire_id: vendeurId,
        contenu,
      }])

    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      router.push('/messages')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contacter le vendeur</h2>

      {annonce && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-600 font-medium">Annonce concernée</p>
          <p className="font-semibold text-gray-800">{annonce.titre}</p>
          <p className="text-gray-500 text-sm">📍 {annonce.ville} — {Number(annonce.prix).toLocaleString()} €</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Votre message *</label>
          <textarea
            rows={5}
            placeholder="Bonjour, je suis intéressé par votre annonce..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>
    </div>
  )
}

export default function NouveauMessage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CHR Occasion</Link>
          <Link href="/annonces" className="text-gray-600 hover:text-blue-600">← Retour</Link>
        </div>
      </header>
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Chargement...</div>}>
        <NouveauMessageForm />
      </Suspense>
    </main>
  )
}