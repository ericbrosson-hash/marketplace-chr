'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Estimer() {
  const [form, setForm] = useState({
    materiel: '',
    marque: '',
    etat: '',
    age: '',
    description: '',
  })
  const [resultat, setResultat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEstimer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResultat(null)

    const prompt = `Tu es un expert en matériel de restauration professionnelle d'occasion (CHR). 
Un professionnel souhaite estimer le prix de vente de son matériel.

Voici les informations :
- Matériel : ${form.materiel}
- Marque : ${form.marque || 'Non précisée'}
- État : ${form.etat}
- Âge approximatif : ${form.age || 'Non précisé'}
- Description : ${form.description || 'Aucune'}

Donne une estimation de prix de revente en France pour ce matériel d'occasion entre professionnels.
Réponds avec :
1. Une fourchette de prix réaliste (ex: 800€ - 1200€)
2. Le prix recommandé pour une vente rapide
3. 2-3 conseils courts pour maximiser la valeur à la revente

Sois concis et pratique.`

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await response.json()
      const text = data.content?.map((b: any) => b.text || '').join('')
      setResultat(text)
    } catch (err) {
      setResultat('Erreur lors de l\'estimation. Réessaie.')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">CHR Occasion</Link>
          <Link href="/annonces" className="text-gray-600 hover:text-blue-600">← Annonces</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Estimation IA</h2>
          <p className="text-gray-500 mt-1">Obtenez une estimation de prix pour votre matériel CHR d'occasion</p>
        </div>

        <form onSubmit={handleEstimer} className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de matériel *</label>
            <input
              type="text"
              placeholder="Ex: Four à convection, Lave-vaisselle professionnel..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.materiel}
              onChange={(e) => setForm({...form, materiel: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque / Modèle</label>
            <input
              type="text"
              placeholder="Ex: Rational SCC61, Hobart AM15..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.marque}
              onChange={(e) => setForm({...form, marque: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">État *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.etat}
              onChange={(e) => setForm({...form, etat: e.target.value})}
              required
            >
              <option value="">Choisir l'état</option>
              <option value="Neuf">Neuf</option>
              <option value="Très bon état">Très bon état</option>
              <option value="Bon état">Bon état</option>
              <option value="Correct">Correct</option>
              <option value="Pour pièces">Pour pièces</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Âge approximatif</label>
            <input
              type="text"
              placeholder="Ex: 2 ans, 5 ans..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.age}
              onChange={(e) => setForm({...form, age: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description complémentaire</label>
            <textarea
              rows={3}
              placeholder="Historique, entretien, accessoires inclus..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '⏳ Analyse en cours...' : '✨ Estimer le prix'}
          </button>
        </form>

        {/* Résultat */}
        {resultat && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
            <h3 className="font-bold text-gray-800 mb-3">💡 Estimation IA</h3>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {resultat}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link
                href="/publier"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Publier mon annonce →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}