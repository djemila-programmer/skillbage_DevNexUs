'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { ArrowLeft, Award, Check } from 'lucide-react'

export default function CreateBadge() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domaine: '',
    skills: '',
    criteresDebutant: '',
    criteresIntermediaire: '',
    criteresExpert: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.domaine) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')

      // Créer un TYPE de badge (template)
      const response = await fetch(`${API_URL}/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          domaine: formData.domaine,
          skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s),
          criteres: {
            debutant: formData.criteresDebutant,
            intermediaire: formData.criteresIntermediaire,
            expert: formData.criteresExpert
          },
          issuerId: user?.id,
          isTemplate: true // C'est un type de badge, pas une attribution
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de la création du badge')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/badges')
      }, 2000)
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la création du badge'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Créer un Badge
        </h1>
        <p className="text-sm text-gray-600">
          Créez et émettez un nouveau badge de compétence pour vos apprenants
        </p>
      </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-700 text-sm font-medium">Type de badge créé avec succès ! Redirection...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCreateBadge} className="space-y-6">
            
            {/* Badge Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Nom de la compétence *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: React.js, Python, Figma..."
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Domaine */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Domaine *
              </label>
              <select
                name="domaine"
                value={formData.domaine}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choisir un domaine</option>
                <option value="dev">Développement Web</option>
                <option value="mobile">Développement Mobile</option>
                <option value="design">Design UI/UX</option>
                <option value="data">Data & IA</option>
                <option value="cyber">Cybersécurité</option>
                <option value="blockchain">Blockchain</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Description courte
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez cette compétence en une phrase..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Compétences associées
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, TypeScript, Next.js (séparés par des virgules)"
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Criteria for each level */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Critères par niveau</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Critères niveau Débutant
                </label>
                <textarea
                  name="criteresDebutant"
                  value={formData.criteresDebutant}
                  onChange={handleChange}
                  placeholder="Que doit maîtriser l'apprenant pour obtenir le niveau débutant ?"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Critères niveau Intermédiaire
                </label>
                <textarea
                  name="criteresIntermediaire"
                  value={formData.criteresIntermediaire}
                  onChange={handleChange}
                  placeholder="Que doit maîtriser l'apprenant pour obtenir le niveau intermédiaire ?"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Critères niveau Expert
                </label>
                <textarea
                  name="criteresExpert"
                  value={formData.criteresExpert}
                  onChange={handleChange}
                  placeholder="Que doit maîtriser l'apprenant pour obtenir le niveau expert ?"
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-orange-800 text-white hover:bg-orange-900'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  Créer le type de badge
                </>
              )}
            </button>
          </form>
    </div>
  )
}
