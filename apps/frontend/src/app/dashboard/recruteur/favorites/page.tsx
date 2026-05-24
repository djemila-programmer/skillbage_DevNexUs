'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Award, ExternalLink, Trash2, Search, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

interface FavoriteTalent {
  id: string
  fullName: string
  email: string
  city?: string
  objective?: string
  badges: any[]
  badgeCount: number
  addedAt: string
}

export default function RecruiterFavorites() {
  const { user } = useAuthStore()
  const [favorites, setFavorites] = useState<FavoriteTalent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTalent, setSelectedTalent] = useState<FavoriteTalent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('recruiter_favorites_data')
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erreur chargement favoris:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveFavorites = (newFavorites: FavoriteTalent[]) => {
    // Sauvegarder les IDs séparément
    const ids = newFavorites.map(f => f.id)
    localStorage.setItem('recruiter_favorites', JSON.stringify(ids))
    localStorage.setItem('recruiter_favorites_data', JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }

  const removeFavorite = (talentId: string) => {
    const updated = favorites.filter(f => f.id !== talentId)
    saveFavorites(updated)
  }

  const filteredFavorites = favorites.filter(talent =>
    talent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    talent.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des favoris...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes favoris
        </h1>
        <p className="text-gray-600">
          {favorites.length} talent{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search */}
      {favorites.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans vos favoris..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h3>
          <p className="text-gray-500 mb-6">
            Explorez les talents et ajoutez-les à vos favoris en cliquant sur le cœur
          </p>
          <Link
            href="/dashboard/recruteur"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Explorer les talents
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun résultat pour cette recherche</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((talent) => (
            <div
              key={talent.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition group relative"
            >
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFavorite(talent.id)
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Retirer des favoris"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-4 pr-12">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {talent.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition">
                    {talent.fullName}
                  </h3>
                  {talent.city && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      {talent.city}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Badges */}
              {talent.badges.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Derniers badges
                  </p>
                  <div className="space-y-2">
                    {talent.badges.slice(0, 3).map((badge: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-700 truncate">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Badges */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Certifications</span>
                  <span className="text-lg font-bold text-orange-600">
                    {talent.badgeCount}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTalent(talent)}
                    className="flex-1 px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition"
                  >
                    Voir profil
                  </button>
                  <Link
                    href={`/verify?id=${talent.id}`}
                    target="_blank"
                    className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Added Date */}
              <div className="mt-3 text-xs text-gray-400">
                Ajouté le {new Date(talent.addedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Talent Profile Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Profil du candidat
              </h2>
              <button
                onClick={() => setSelectedTalent(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Info */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                  {selectedTalent.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedTalent.fullName}
                  </h3>
                  {selectedTalent.objective && (
                    <p className="text-gray-600 mb-2">{selectedTalent.objective}</p>
                  )}
                  {selectedTalent.city && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {selectedTalent.city}
                    </div>
                  )}
                </div>
              </div>

              {/* All Badges */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Toutes les certifications ({selectedTalent.badgeCount})
                </h4>
                <div className="grid gap-3">
                  {selectedTalent.badges.map((badge: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{badge.name}</h5>
                        {badge.niveau && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {badge.niveau}
                          </span>
                        )}
                      </div>
                      {badge.skills && (
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(badge.skills) ? (
                            badge.skills.map((skill: string, sIdx: number) => (
                              <span key={sIdx} className="text-xs px-2 py-1 bg-white rounded">
                                {skill}
                              </span>
                            ))
                          ) : (
                            badge.skills.split(',').map((skill: string, sIdx: number) => (
                              <span key={sIdx} className="text-xs px-2 py-1 bg-white rounded">
                                {skill.trim()}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/verify?id=${selectedTalent.id}`}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir le portfolio public
                </Link>
                <button
                  onClick={() => setSelectedTalent(null)}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
