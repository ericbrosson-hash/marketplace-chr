import Link from 'next/link'
 
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CHR Occasion</h1>
          <div className="flex gap-4">
            <Link href="/annonces" className="text-gray-600 hover:text-blue-600">
              Annonces
            </Link>
            <Link href="/publier" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Publier une annonce
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Le marché du matériel de restauration professionnel
        </h2>
        <p className="text-xl text-gray-500 mb-8">
          Achetez et vendez du matériel CHR d'occasion entre professionnels
        </p>
        <Link href="/annonces" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700">
          Voir les annonces
        </Link>
      </section>

      {/* Catégories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Catégories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { nom: "Cuisson", emoji: "🔥" },
            { nom: "Réfrigération", emoji: "❄️" },
            { nom: "Laverie", emoji: "🫧" },
            { nom: "Préparation", emoji: "🔪" },
            { nom: "Mobilier", emoji: "🪑" },
            { nom: "Bar", emoji: "🍺" },
            { nom: "Caisse", emoji: "💳" },
            { nom: "Autre", emoji: "📦" },
          ].map((cat) => (
            <div key={cat.nom} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md cursor-pointer">
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-semibold text-gray-700">{cat.nom}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}