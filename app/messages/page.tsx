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

      // Récupère tous les messages où je suis impliqué
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

      // Dédoublonne par annonce_id pour avoir une conversation par annonce
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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CHR Occasion</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes messages</h2>

        {loading && <p className="text-gray-400">Chargement...</p>}

        {!loading && conversations.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Aucun message pour le moment</p>
          </div>
        )}

        <div className="space-y-3">
          {conversations.map((conv) => {
            const interlocuteur = conv.expediteur_id === userId
              ? conv.destinataire?.nom
              : conv.expediteur?.nom
            return (
              <Link
                key={conv.annonce_id}
                href={`/messages/${conv.annonce_id}?interlocuteur=${conv.expediteur_id === userId ? conv.destinataire_id : conv.expediteur_id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{conv.annonces?.titre}</p>
                    <p className="text-sm text-gray-500">📍 {conv.annonces?.ville}</p>
                    <p className="text-sm text-blue-600 mt-1">Avec : {interlocuteur || 'Pro CHR'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(conv.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    {!conv.lu && conv.destinataire_id === userId && (
                      <span className="inline-block mt-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Nouveau</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-2 line-clamp-1">{conv.contenu}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}