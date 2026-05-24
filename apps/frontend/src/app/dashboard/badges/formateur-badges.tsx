'use client'

import { Shield, Users, Calendar, Award, Search, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface Badge {
  id: string
  name: string
  description: string
  skills: string | string[]
  niveau: string
  status: string
  issuedAt: string
  recipient: {
    id: string
    fullName: string
  }
}

export default function ListeBadgesFormateur() {
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchBadges()
  }, [user?.id])

  const fetchBadges = async () => {
    if (!user?.id) return
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Filter only badges where this user is the issuer
        const issuedBadges = data.filter((b: any) => b.issuer?.id === user.id)
        setBadges(issuedBadges)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBadges = badges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterActive === 'all' || 
      (filterActive === 'active' && badge.status === 'active') || 
      (filterActive === 'inactive' && badge.status !== 'active')
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement des badges...</div>
      </div>
    )
  }

  const totalBadges = badges.length
  const activeBadges = badges.filter(b => b.status === 'active').length
  const totalRecipients = new Set(badges.map(b => b.recipient?.id)).size

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Liste des Badges
        </h1>
        <p className="text-sm text-gray-600">
          Gérez et suivez tous vos badges de compétence.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              BADGES CRÉÉS
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#AB35001A' }}>
              <Award className="w-5 h-5" style={{ color: '#AB3500' }} />
            </div>
          </div>
          <div className="text-3xl font-bold" style={{ color: '#AB3500' }}>{totalBadges}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              BADGES ACTIFS
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">{activeBadges}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              TALENTS CERTIFIÉS
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">{totalRecipients}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              CE MOIS
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {badges.filter(b => {
              const issued = new Date(b.issuedAt)
              const now = new Date()
              return issued.getMonth() === now.getMonth() && issued.getFullYear() === now.getFullYear()
            }).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un badge..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive('all')}
              className={`px-4 py-3 rounded-xl font-medium transition ${
                filterActive === 'all' 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={filterActive === 'all' ? { backgroundColor: '#AB3500' } : {}}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={`px-4 py-3 rounded-xl font-medium transition ${
                filterActive === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={`px-4 py-3 rounded-xl font-medium transition ${
                filterActive === 'inactive' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Inactifs
            </button>
          </div>
        </div>
      </div>

      {/* Badges List */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-20">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Aucun badge ne correspond à votre recherche.' : 'Vous n\'avez pas encore créé de badges.'}
          </p>
          {!searchTerm && (
            <Link
              href="/dashboard/create-badge"
              className="inline-block px-6 py-3 text-white rounded-xl font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#AB3500' }}
            >
              Créer un badge
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Badge
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Talent
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBadges.map((badge) => (
                <tr key={badge.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#AB35001A' }}>
                        <Shield className="w-5 h-5" style={{ color: '#AB3500' }} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{badge.name}</div>
                        <div className="text-xs text-gray-500">
                          {(Array.isArray(badge.skills) ? badge.skills.slice(0, 2).join(', ') : badge.skills?.split(',').slice(0, 2).join(', ') || '')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{badge.recipient?.fullName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      badge.niveau?.toLowerCase() === 'expert' || badge.niveau?.toLowerCase() === 'avance'
                        ? 'bg-orange-900 text-white'
                        : badge.niveau?.toLowerCase() === 'intermediaire'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {badge.niveau}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(badge.issuedAt).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      badge.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {badge.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/badges/${badge.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
