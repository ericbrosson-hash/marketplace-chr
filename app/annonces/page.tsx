import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Annonces() {
  const { data: annonces, error } = await supabase
    .from('annonces')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CHR Occasion
          </Link>
          <Link href="/publier" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Publier une annonce
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {annonces?.length || 0} annonces disponibles
        </h2>

        {/* Filtres */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["Tous", "Cuisson", "Réfrigération", "Laverie", "Préparation", "Mobilier", "Bar"].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 bg-white"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Liste annonces */}
        {error && (
          <p className="text-red-500">Erreur de chargement des annonces</p>
        )}

        {annonces?.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Aucune annonce pour le moment</p>
            <Link href="/publier" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">
              Publier la première annonce
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annonces?.map((annonce) => (
            <div key={annonce.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {annonce.categorie}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {annonce.etat}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mt-3 mb-2">
                {annonce.titre}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                {annonce.description}
              </p>
              <p className="text-gray-500 text-sm mb-4">📍 {annonce.ville}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {Number(annonce.prix).toLocaleString()}€
                </span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Contacter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}