import Link from 'next/link'

const annonces = [
  {
    id: 1,
    titre: "Four Rational SCC61 occasion",
    prix: 2500,
    ville: "Lyon",
    categorie: "Cuisson",
    etat: "Bon état",
    emoji: "🔥"
  },
  {
    id: 2,
    titre: "Armoire réfrigérée Mercatus 400L",
    prix: 800,
    ville: "Paris",
    categorie: "Réfrigération",
    etat: "Très bon état",
    emoji: "❄️"
  },
  {
    id: 3,
    titre: "Lave-vaisselle professionnel Hobart",
    prix: 1200,
    ville: "Marseille",
    categorie: "Laverie",
    etat: "Bon état",
    emoji: "🫧"
  },
  {
    id: 4,
    titre: "Trancheuse Berkel 250mm",
    prix: 450,
    ville: "Bordeaux",
    categorie: "Préparation",
    etat: "Correct",
    emoji: "🔪"
  },
]

export default function Annonces() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
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
          {annonces.length} annonces disponibles
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annonces.map((annonce) => (
            <div key={annonce.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="text-5xl mb-4 text-center">{annonce.emoji}</div>
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
              <p className="text-gray-500 text-sm mb-4">📍 {annonce.ville}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  {annonce.prix.toLocaleString()}€
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