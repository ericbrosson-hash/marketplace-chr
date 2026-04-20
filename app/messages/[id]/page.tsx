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

      const { data: ann } = await supabase
        .from('annonces')
        .select('titre, ville, prix')
        .eq('id', id)
        .single()
      setAnnonce(ann)

      const { data: msgs } = await supabase
        .from('messages')
        .select(`*, expediteur:profiles!expediteur_id (nom)`)
        .eq('annonce_id', id)
        .or(`expediteur_id.eq.${user.id},destinataire_id.eq.${user.id}`)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])

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
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--chr-bg)' }}>

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
            <Link href="/messages" className="text-sm" style={{ color: '#fff' }}>← Mes messages</Link>
            <Link
              href="/publier"
              className="text-sm font-semibold px-4 py-1.5 rounded-md"
              style={{ background: 'var(--chr-accent)', color: 'var(--chr-accent-text)' }}
            >
              Publier une annonce
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-6 w-full flex flex-col flex-1">

        {/* Annonce */}
        {annonce && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--chr-muted)' }}>
              Annonce
            </p>
            <p className="font-semibold text-sm" style={{ color: 'var(--chr-text)' }}>{annonce.titre}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--chr-muted)' }}>
              📍 {annonce.ville} — {Number(annonce.prix).toLocaleString('fr-FR')} €
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
          {messages.map((msg) => {
            const isMine = msg.expediteur_id === userId
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-xs rounded-2xl px-4 py-3"
                  style={{
                    background: isMine ? 'var(--chr-btn)' : 'var(--chr-card)',
                    border: isMine ? 'none' : '1px solid var(--chr-border)',
                  }}
                >
                  {!isMine && (
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: 'var(--chr-accent)' }}
                    >
                      {msg.expediteur?.nom || 'Pro CHR'}
                    </p>
                  )}
                  <p
                    className="text-sm"
                    style={{ color: isMine ? 'var(--chr-text-inverse)' : 'var(--chr-text)' }}
                  >
                    {msg.contenu}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: isMine ? 'rgba(255,255,255,0.5)' : 'var(--chr-muted)' }}
                  >
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
            style={{
              flex: 1,
              border: '1px solid var(--chr-border)',
              borderRadius: 'var(--chr-radius-sm)',
              padding: '8px 14px',
              fontSize: '14px',
              color: 'var(--chr-text)',
              background: 'var(--chr-card)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
            style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
          >
            Envoyer
          </button>
        </form>

      </div>
    </main>
  )
}