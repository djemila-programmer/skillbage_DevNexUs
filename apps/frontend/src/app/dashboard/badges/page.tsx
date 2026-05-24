'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, Plus, Users, Edit, Eye, Send, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface BadgeTemplate {
  id: string
  name: string
  description: string
  skills: string | string[]
  domaine: string
  niveaux: string[]
  createdAt: string
  recipientsCount: number
}

export default function MyBadgesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<BadgeTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Filtrer les badges créés par ce formateur
        const myBadges = data.filter((b: any) => 
          b.issuerId === user?.id || b.issuer?.id === user?.id
        )
        setBadges(myBadges)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBadges = badges.filter(badge =>
    badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    badge.domaine?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateBadge = () => {
    router.push('/dashboard/create-badge')
  }

  const handleAttributeBadge = (badgeId: string) => {
    router.push(`/dashboard/attribute-badge?badgeId=${badgeId}`)
  }

  const handleEditBadge = (badgeId: string) => {
    router.push(`/dashboard/edit-badge/${badgeId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos badges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Badges
          </h1>
          <p className="text-sm text-gray-600">
            {user?.role === 'formateur' 
              ? 'Gérez vos types de badges et compétences certifiables'
              : 'Consultez vos badges et compétences certifiées'
            }
          </p>
        </div>
        {/* Bouton "Créer un badge" UNIQUEMENT pour les formateurs */}
        {user?.role === 'formateur' && (
          <button
            onClick={handleCreateBadge}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Créer un badge
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un badge par nom ou domaine..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Badges Grid */}
      {filteredBadges.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchQuery 
              ? 'Aucun badge trouvé' 
              : user?.role === 'formateur' 
                ? 'Aucun badge créé'
                : 'Aucun badge reçu'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Essayez avec d\'autres termes de recherche'
              : user?.role === 'formateur'
                ? 'Commencez par créer votre premier type de badge'
                : 'Vous n\'avez pas encore reçu de badges. Continuez à progresser !'
            }
          </p>
          {/* Bouton "Créer" UNIQUEMENT pour les formateurs */}
          {!searchQuery && user?.role === 'formateur' && (
            <button
              onClick={handleCreateBadge}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer un badge
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Badge Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                <div className="flex items-start justify-between mb-3">
                  <Award className="w-8 h-8 text-white" />
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold">
                    {badge.domaine || 'Général'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {badge.name}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Badge Body */}
              <div className="p-6">
                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{badge.recipientsCount || 0} apprenants</span>
                  </div>
                </div>

                {/* Skills */}
                {badge.skills && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Compétences
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(badge.skills) 
                        ? badge.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))
                        : typeof badge.skills === 'string' && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                              {badge.skills}
                            </span>
                          )
                      }
                    </div>
                  </div>
                )}

                {/* Levels */}
                {badge.niveaux && badge.niveaux.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Niveaux disponibles
                    </p>
                    <div className="flex gap-2">
                      {badge.niveaux.map((niveau, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                        >
                          {niveau}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleAttributeBadge(badge.id)}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Attribuer
                  </button>
                  <button
                    onClick={() => handleEditBadge(badge.id)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
