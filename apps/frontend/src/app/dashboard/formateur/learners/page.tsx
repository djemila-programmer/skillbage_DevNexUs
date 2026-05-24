'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Search, Filter, Award, Calendar, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface Learner {
  id: string
  fullName: string
  email: string
  badgesCount: number
  lastBadgeDate: string
  city?: string
  photoUrl?: string
}

export default function LearnersPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [learners, setLearners] = useState<Learner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDomain, setFilterDomain] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  useEffect(() => {
    fetchLearners()
  }, [])

  const fetchLearners = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      // Récupérer tous les badges émis par ce formateur
      const badgesResponse = await fetch(`${API_URL}/badges`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (badgesResponse.ok) {
        const allBadges = await badgesResponse.json()
        
        // Filtrer les badges de ce formateur
        const formateurBadges = allBadges.filter((b: any) => 
          b.issuerId === user?.id || b.issuer?.id === user?.id
        )

        // Grouper par apprenant
        const learnersMap = new Map<string, Learner>()
        
        formateurBadges.forEach((badge: any) => {
          const recipientId = badge.recipientId || badge.recipient?.id
          if (recipientId) {
            const existing = learnersMap.get(recipientId)
            const badgeDate = new Date(badge.issuedAt || badge.createdAt)
            
            if (existing) {
              existing.badgesCount++
              if (badgeDate > new Date(existing.lastBadgeDate)) {
                existing.lastBadgeDate = badge.issuedAt || badge.createdAt
              }
            } else {
              learnersMap.set(recipientId, {
                id: recipientId,
                fullName: badge.recipient?.fullName || 'Apprenant',
                email: badge.recipient?.email || '',
                badgesCount: 1,
                lastBadgeDate: badge.issuedAt || badge.createdAt,
                city: badge.recipient?.city,
                photoUrl: badge.recipient?.photoUrl
              })
            }
          }
        })

        setLearners(Array.from(learnersMap.values()))
      }
    } catch (error) {
      console.error('Error fetching learners:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLearners = learners.filter(learner => {
    const matchesSearch = learner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         learner.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleViewPortfolio = (learnerId: string) => {
    window.open(`/p/${learnerId}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des apprenants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Apprenants
        </h1>
        <p className="text-sm text-gray-600">
          Liste de tous les talents que vous avez certifiés
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter by Domain */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="">Tous les domaines</option>
              <option value="dev">Développement</option>
              <option value="design">Design</option>
              <option value="data">Data & IA</option>
              <option value="cyber">Cybersécurité</option>
            </select>
          </div>

          {/* Filter by Level */}
          <div className="relative">
            <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none"
            >
              <option value="">Tous les niveaux</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>

        </div>
      </div>

      {/* Learners Table */}
      {filteredLearners.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchQuery ? 'Aucun apprenant trouvé' : 'Aucun apprenant certifié'}
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? 'Essayez avec d\'autres termes de recherche'
              : 'Commencez par attribuer des badges à des talents'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Apprenant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Badges reçus
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dernier badge
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLearners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-700">
                            {learner.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {learner.fullName}
                          </p>
                          {learner.city && (
                            <p className="text-xs text-gray-500">
                              {learner.city}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{learner.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        <Award className="w-4 h-4 mr-1" />
                        {learner.badgesCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(learner.lastBadgeDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewPortfolio(learner.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-semibold transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Voir portfolio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total des apprenants certifiés</p>
            <p className="text-3xl font-bold text-orange-600">{learners.length}</p>
          </div>
          <Users className="w-12 h-12 text-orange-300" />
        </div>
      </div>

    </div>
  )
}
