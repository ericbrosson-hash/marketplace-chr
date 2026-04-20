import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function AnnonceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: annonce, error } = await supabase
    .from('annonces')
    .select(`
      *,
      profiles (
        id,
        nom,
        ville,
        telephone
      )
    `)
    .eq('id', id)
    .single()

  if (error || !annonce) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CHR Occasion
          </Link>
          <Link href="/annonces" className="text-gray-600 hover:text-blue-600">
            ← Retour aux annonces
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">

          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {annonce.categorie}
            </span>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {annonce.etat}
            </span>
          </div>

          {/* Titre + prix */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {annonce.titre}
          </h1>
          <p className="text-4xl font-bold text-blue-600 mb-6">
            {Number(annonce.prix).toLocaleString()} €
          </p>

          {/* Localisation + date */}
          <div className="flex gap-6 text-gray-500 text-sm mb-8">
            <span>📍 {annonce.ville}</span>
            <span>🗓 {new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {annonce.description || 'Aucune description fournie.'}
            </p>
          </div>

          {/* Vendeur */}
          {annonce.profiles && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Vendeur</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{annonce.profiles.nom || 'Pro CHR'}</p>
                  <p className="text-gray-500 text-sm">📍 {annonce.profiles.ville || annonce.ville}</p>
                </div>
                <Link
                  href={`/messages/nouveau?vendeur=${annonce.profiles.id}&annonce=${annonce.id}`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Contacter le vendeur
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}