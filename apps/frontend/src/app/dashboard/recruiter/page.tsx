'use client'

import { Search, MapPin, Award, Filter, ChevronRight, Star, BookmarkPlus } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

interface Talent {
  id: string
  fullName: string
  email: string
  city?: string
  domains?: string
  modules?: string
  badgeCount: number
  recentBadges: Array<{
    name: string
    niveau: string
    issuer: string
  }>
}

export default function RecruiterDashboard() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [savedCandidates, setSavedCandidates] = useState<string[]>([])

  const domains = [
    'Développement Web',
    'Développement Mobile',
    'Design UI/UX',
    'Data & IA',
    'Cybersécurité'
  ]

  const levels = ['Débutant', 'Intermédiaire', 'Expert']

  useEffect(() => {
    fetchTalents()
  }, [])

  const fetchTalents = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      // Construire les paramètres de recherche
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedDomain) params.append('domain', selectedDomain)
      if (selectedLevel) params.append('level', selectedLevel)

      const response = await fetch(`${API_URL}/users/talents?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTalents(data)
      }
    } catch (error) {
      console.error('Error fetching talents:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSaveCandidate = (talentId: string) => {
    setSavedCandidates(prev => 
      prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
    )
  }

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = !searchTerm || 
      talent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDomain = !selectedDomain || talent.domains?.includes(selectedDomain)
    const matchesLevel = !selectedLevel || talent.modules?.includes(selectedLevel)

    return matchesSearch && matchesDomain && matchesLevel
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recherche de Talents
        </h1>
        <p className="text-gray-600">
          Trouvez les profils qui correspondent à vos besoins
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#AB3500]" />
          <h3 className="font-semibold text-gray-900">Filtres de recherche</h3>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Nom ou email
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un talent..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#AB3500] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Domain Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Domaine
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#AB3500] focus:border-transparent outline-none"
            >
              <option value="">Tous les domaines</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Niveau minimum
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#AB3500] focus:border-transparent outline-none"
            >
              <option value="">Tous niveaux</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {filteredTalents.length} talent{filteredTalents.length > 1 ? 's' : ''} trouvé{filteredTalents.length > 1 ? 's' : ''}
          </h3>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun talent trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map(talent => (
              <div key={talent.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-900">
                        {talent.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{talent.fullName}</h3>
                      {talent.city && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {talent.city}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSaveCandidate(talent.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <BookmarkPlus 
                      className={`w-5 h-5 ${savedCandidates.includes(talent.id) ? 'fill-[#AB3500] text-[#AB3500]' : 'text-gray-400'}`} 
                    />
                  </button>
                </div>

                {/* Recent Badges */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Dernières certifications
                  </p>
                  <div className="space-y-2">
                    {talent.recentBadges.slice(0, 3).map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-[#AB3500]" />
                        <span className="text-gray-700">{badge.name}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {badge.niveau}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span className="font-semibold">{talent.badgeCount}</span>
                    <span>certifications</span>
                  </div>
                  <Link
                    href={`/dashboard/recruiter/candidate/${talent.id}`}
                    className="flex items-center gap-1 text-[#AB3500] font-semibold text-sm group-hover:gap-2 transition-all"
                  >
                    Voir le profil
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
