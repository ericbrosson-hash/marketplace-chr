'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Conversation({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const interlocuteurId = searchParams.get('interlocuteur')

  const [annonceId, setAnnonceId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [annonce, setAnnonce] = useState<any>(null)
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { id } = await params
      setAnnonceId(id)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/connexion'); return }
      setUserId(user.id)

      // Récupère l'annonce
      const { data: ann } = await supabase
        .from('annonces')
        .select('titre, ville, prix')
        .eq('id', id)
        .single()
      setAnnonce(ann)

      // Récupère les messages de cette conversation
      const { data: msgs } = await supabase
        .from('messages')
        .select(`*, expediteur:profiles!expediteur_id (nom)`)
        .eq('annonce_id', id)
        .or(`expediteur_id.eq.${user.id},destinataire_id.eq.${user.id}`)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])

      // Marque les messages comme lus
      await supabase
        .from('messages')
        .update({ lu: true })
        .eq('annonce_id', id)
        .eq('destinataire_id', user.id)
    }
    init()
  }, [router, params])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contenu.trim() || !userId || !annonceId || !interlocuteurId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        annonce_id: annonceId,
        expediteur_id: userId,
        destinataire_id: interlocuteurId,
        contenu,
      }])
      .select(`*, expediteur:profiles!expediteur_id (nom)`)
      .single()

    if (!error && data) {
      setMessages(prev => [...prev, data])
      setContenu('')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CHR Occasion</Link>
          <Link href="/messages" className="text-gray-600 hover:text-blue-600">← Mes messages</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 w-full flex flex-col flex-1">

        {annonce && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="font-semibold text-gray-800">{annonce.titre}</p>
            <p className="text-gray-500 text-sm">📍 {annonce.ville} — {Number(annonce.prix).toLocaleString()} €</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
          {messages.map((msg) => {
            const isMine = msg.expediteur_id === userId
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-3 ${isMine ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                  {!isMine && (
                    <p className="text-xs font-medium text-blue-600 mb-1">{msg.expediteur?.nom || 'Pro CHR'}</p>
                  )}
                  <p className="text-sm">{msg.contenu}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            placeholder="Votre message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Envoyer
          </button>
        </form>
      </div>
    </main>
  )
}