'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Award, Filter, ChevronDown, ExternalLink, X, Heart } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

interface Talent {
  id: string
  fullName: string
  email: string
  city?: string
  objective?: string
  badges: any[]
  badgeCount: number
  customPortfolioUrl?: string
  skillBadgeId?: string
}

export default function RecruiterDashboard() {
  const { user } = useAuthStore()
  const [talents, setTalents] = useState<Talent[]>([])
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filtres
  const [filters, setFilters] = useState({
    domaine: '',
    niveau: '',
    competence: '',
    ville: ''
  })

  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [showPortfolio, setShowPortfolio] = useState(false)
  const [portfolioTalent, setPortfolioTalent] = useState<any>(null)
  const [portfolioBadges, setPortfolioBadges] = useState<any[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Charger les favoris depuis localStorage
    const saved = localStorage.getItem('recruiter_favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  const toggleFavorite = (talentId: string, talent: Talent) => {
    const newFavorites = favorites.includes(talentId) 
      ? favorites.filter(id => id !== talentId)
      : [...favorites, talentId]
    
    // Sauvegarder le talent complet si on l'ajoute
    if (!favorites.includes(talentId)) {
      const allFavorites = JSON.parse(localStorage.getItem('recruiter_favorites_data') || '[]')
      allFavorites.push({ ...talent, addedAt: new Date().toISOString() })
      localStorage.setItem('recruiter_favorites_data', JSON.stringify(allFavorites))
    } else {
      const allFavorites = JSON.parse(localStorage.getItem('recruiter_favorites_data') || '[]')
      const filtered = allFavorites.filter((f: any) => f.id !== talentId)
      localStorage.setItem('recruiter_favorites_data', JSON.stringify(filtered))
    }
    
    localStorage.setItem('recruiter_favorites', JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }

  const openPortfolioModal = async (talent: Talent) => {
    setShowPortfolio(true)
    setPortfolioTalent(talent)
    setPortfolioLoading(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges/user/${talent.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPortfolioBadges(data)
      }
    } catch (error) {
      console.error('Erreur chargement portfolio:', error)
    } finally {
      setPortfolioLoading(false)
    }
  }

  useEffect(() => {
    fetchTalents()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [talents, filters])

  const fetchTalents = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges/search?q=`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTalents(data)
        setFilteredTalents(data)
      }
    } catch (error) {
      console.error('Erreur chargement talents:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...talents]

    // Filtre par domaine
    if (filters.domaine) {
      filtered = filtered.filter(talent => 
        talent.badges.some((badge: any) => 
          badge.name?.toLowerCase().includes(filters.domaine.toLowerCase())
        )
      )
    }

    // Filtre par compétence
    if (filters.competence) {
      filtered = filtered.filter(talent => 
        talent.badges.some((badge: any) => 
          badge.skills?.toLowerCase().includes(filters.competence.toLowerCase())
        )
      )
    }

    // Filtre par ville
    if (filters.ville) {
      filtered = filtered.filter(talent => 
        talent.city?.toLowerCase().includes(filters.ville.toLowerCase())
      )
    }

    setFilteredTalents(filtered)
  }

  const resetFilters = () => {
    setFilters({
      domaine: '',
      niveau: '',
      competence: '',
      ville: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des talents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recherche de talents
        </h1>
        <p className="text-gray-600">
          Trouvez les meilleurs talents certifiés pour votre entreprise
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un talent par nom ou email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            onChange={(e) => {
              const query = e.target.value.toLowerCase()
              const filtered = talents.filter(t => 
                t.fullName.toLowerCase().includes(query) || 
                t.email.toLowerCase().includes(query)
              )
              setFilteredTalents(filtered)
            }}
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <Filter className="w-4 h-4" />
          Filtres avancés
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filtres avancés</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Réinitialiser
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Domaine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine de compétence
              </label>
              <select
                value={filters.domaine}
                onChange={(e) => setFilters({...filters, domaine: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Tous les domaines</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Full Stack</option>
                <option value="mobile">Mobile</option>
                <option value="design">Design</option>
                <option value="data">Data</option>
              </select>
            </div>

            {/* Niveau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau minimum
              </label>
              <select
                value={filters.niveau}
                onChange={(e) => setFilters({...filters, niveau: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Tous niveaux</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>

            {/* Compétence spécifique */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétence spécifique
              </label>
              <input
                type="text"
                value={filters.competence}
                onChange={(e) => setFilters({...filters, competence: e.target.value})}
                placeholder="Ex: React.js, Figma..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                value={filters.ville}
                onChange={(e) => setFilters({...filters, ville: e.target.value})}
                placeholder="Ex: Ouagadougou..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredTalents.length} talent{filteredTalents.length > 1 ? 's' : ''} trouvé{filteredTalents.length > 1 ? 's' : ''}
      </div>

      {/* Talents Grid */}
      {filteredTalents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun talent ne correspond à vos critères</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => (
            <div
              key={talent.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition group relative"
            >
              {/* Bouton Favori */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(talent.id, talent)
                }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Heart 
                  className={`w-5 h-5 ${
                    favorites.includes(talent.id) 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-400'
                  }`} 
                />
              </button>

              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-4 pr-12" onClick={() => setSelectedTalent(talent)}>
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
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTalent(talent)
                        }}
                      >
                        <Award className="w-4 h-4 text-orange-600" />
                        <span className="text-gray-700 truncate hover:text-orange-600">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Badges */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Certifications</span>
                  <span className="text-lg font-bold text-orange-600">
                    {talent.badgeCount}
                  </span>
                </div>
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
                    <div 
                      key={idx} 
                      className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => setSelectedBadge(badge)}
                    >
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
                      <p className="text-xs text-gray-500 mt-2">Cliquez pour voir les détails</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => openPortfolioModal(selectedTalent)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir le portfolio
                </button>
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

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Détails du badge
              </h2>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Badge Name */}
              <div>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">
                  {selectedBadge.name}
                </h3>
                {selectedBadge.description && (
                  <p className="text-gray-600">{selectedBadge.description}</p>
                )}
              </div>

              {/* Niveau */}
              {selectedBadge.niveau && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Niveau</p>
                  <p className="text-lg font-bold text-blue-700">{selectedBadge.niveau}</p>
                </div>
              )}

              {/* Compétences */}
              {selectedBadge.skills && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Compétences acquises</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedBadge.skills) ? (
                      selectedBadge.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      selectedBadge.skills.split(',').map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {skill.trim()}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Émetteur */}
              {selectedBadge.issuer && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Émis par</p>
                  <p className="text-gray-900 font-medium">{selectedBadge.issuer}</p>
                </div>
              )}

              {/* Date d'obtention */}
              {selectedBadge.issuedAt && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Date d'obtention</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(selectedBadge.issuedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* ID du badge */}
              {selectedBadge.id && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">ID du badge</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedBadge.id}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {showPortfolio && portfolioTalent && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Portfolio de {portfolioTalent.fullName}
              </h2>
              <button
                onClick={() => setShowPortfolio(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {portfolioLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du portfolio...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                      {portfolioTalent.fullName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{portfolioTalent.fullName}</h3>
                      {portfolioTalent.city && (
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {portfolioTalent.city}
                        </div>
                      )}
                      {portfolioTalent.objective && (
                        <p className="text-gray-700">{portfolioTalent.objective}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-3xl font-bold text-orange-600">{portfolioBadges.length}</p>
                      <p className="text-sm text-gray-600 mt-1">Badges obtenus</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">
                        {new Set(portfolioBadges.map(b => b.domain || b.name?.split(' ')[0])).size}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Domaines</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">
                        {new Set(portfolioBadges.map(b => b.issuer?.fullName || b.issuer)).size}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Formateurs</p>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                      Tous les badges ({portfolioBadges.length})
                    </h4>
                    {portfolioBadges.length === 0 ? (
                      <div className="text-center py-12">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucun badge obtenu</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {portfolioBadges.map((badge, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setShowPortfolio(false)
                              setSelectedBadge(badge)
                            }}
                            className="p-6 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:shadow-md transition"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <Award className="w-8 h-8 text-orange-600 flex-shrink-0" />
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 mb-1">{badge.name}</h5>
                                {badge.niveau && (
                                  <span className="inline-block text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {badge.niveau}
                                  </span>
                                )}
                              </div>
                            </div>
                            {badge.skills && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Array.isArray(badge.skills) ? (
                                  badge.skills.slice(0, 3).map((skill: string, sIdx: number) => (
                                    <span key={sIdx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  badge.skills.split(',').slice(0, 3).map((skill: string, sIdx: number) => (
                                    <span key={sIdx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                      {skill.trim()}
                                    </span>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPortfolio(false)}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
