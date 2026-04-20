'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Messages() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/connexion'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          annonces (titre, ville),
          expediteur:profiles!expediteur_id (nom),
          destinataire:profiles!destinataire_id (nom)
        `)
        .or(`expediteur_id.eq.${user.id},destinataire_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      const seen = new Set()
      const convs = (data || []).filter((msg: any) => {
        const key = msg.annonce_id
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      setConversations(convs)
      setLoading(false)
    }
    init()
  }, [router])

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
            <Link href="/messages" className="text-sm" style={{ color: '#fff' }}>Messages</Link>
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

      <div className="max-w-2xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--chr-text)' }}>Mes messages</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--chr-muted)' }}>
            {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
          </p>
        </div>

        {loading && (
          <p className="text-sm" style={{ color: 'var(--chr-muted)' }}>Chargement...</p>
        )}

        {!loading && conversations.length === 0 && (
          <div className="text-center py-24" style={{ color: 'var(--chr-muted)' }}>
            <p className="text-lg font-medium mb-2">Aucun message pour le moment</p>
            <p className="text-sm">Contactez un vendeur depuis une annonce pour démarrer une conversation</p>
          </div>
        )}

        <div className="space-y-2">
          {conversations.map((conv) => {
            const interlocuteur = conv.expediteur_id === userId
              ? conv.destinataire?.nom
              : conv.expediteur?.nom
            const isUnread = !conv.lu && conv.destinataire_id === userId

            return (
              <Link
                key={conv.annonce_id}
                href={`/messages/${conv.annonce_id}?interlocuteur=${conv.expediteur_id === userId ? conv.destinataire_id : conv.expediteur_id}`}
                className="block rounded-xl transition-shadow hover:shadow-sm"
                style={{
                  background: 'var(--chr-card)',
                  border: '1px solid var(--chr-border)',
                  padding: '16px 20px',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--chr-text)' }}>
                      {conv.annonces?.titre}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--chr-muted)' }}>
                      📍 {conv.annonces?.ville}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isUnread && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--chr-accent)', color: 'var(--chr-accent-text)' }}
                      >
                        Nouveau
                      </span>
                    )}
                    <p className="text-xs" style={{ color: 'var(--chr-muted)' }}>
                      {new Date(conv.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: '1px solid var(--chr-border)' }}
                >
                  <p className="text-xs font-medium" style={{ color: 'var(--chr-muted)' }}>
                    Avec : <span style={{ color: 'var(--chr-text)' }}>{interlocuteur || 'Pro CHR'}</span>
                  </p>
                  <p className="text-xs line-clamp-1 max-w-xs text-right" style={{ color: 'var(--chr-muted)' }}>
                    {conv.contenu}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}