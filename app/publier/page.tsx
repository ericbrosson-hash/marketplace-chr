'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Publier() {
  const [form, setForm] = useState({
    titre: '',
    categorie: '',
    etat: '',
    prix: '',
    ville: '',
    description: '',
  })

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const { error } = await supabase
    .from('annonces')
    .insert([{
      titre: form.titre,
      categorie: form.categorie,
      etat: form.etat,
      prix: Number(form.prix),
      ville: form.ville,
      description: form.description,
    }])

  if (error) {
    alert('Erreur : ' + error.message)
  } else {
    alert('Annonce publiée avec succès !')
  }
}

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CHR Occasion
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Publier une annonce
        </h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'annonce *
            </label>
            <input
              type="text"
              placeholder="Ex: Four Rational SCC61 occasion"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.titre}
              onChange={(e) => setForm({...form, titre: e.target.value})}
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.categorie}
              onChange={(e) => setForm({...form, categorie: e.target.value})}
              required
            >
              <option value="">Choisir une catégorie</option>
              <option value="Cuisson">🔥 Cuisson</option>
              <option value="Réfrigération">❄️ Réfrigération</option>
              <option value="Laverie">🫧 Laverie</option>
              <option value="Préparation">🔪 Préparation</option>
              <option value="Mobilier">🪑 Mobilier</option>
              <option value="Bar">🍺 Bar</option>
              <option value="Caisse">💳 Caisse</option>
              <option value="Autre">📦 Autre</option>
            </select>
          </div>

          {/* État */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              État *
            </label>
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

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€) *
            </label>
            <input
              type="number"
              placeholder="Ex: 2500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.prix}
              onChange={(e) => setForm({...form, prix: e.target.value})}
              required
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              placeholder="Ex: Lyon"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.ville}
              onChange={(e) => setForm({...form, ville: e.target.value})}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Décrivez l'état, l'historique, les dimensions..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Publier l'annonce
          </button>
        </form>
      </div>
    </main>
  )
}