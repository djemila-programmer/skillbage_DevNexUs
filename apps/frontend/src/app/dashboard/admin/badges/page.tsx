'use client'

import { Award, Filter, Eye, PowerOff, Power } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface Badge {
  id: string
  name: string
  domain: string
  level: string
  description: string
  issuer: {
    fullName: string
    organisation: string
  }
  recipientCount: number
  status: 'active' | 'disabled'
  createdAt: string
}

export default function ManageBadges() {
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDomain, setFilterDomain] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/admin/badges`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Badges reçus:', data)
        setBadges(data)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBadgeStatus = async (badgeId: string, currentStatus: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      const newStatus = currentStatus === 'active' ? 'disabled' : 'active'
      
      const response = await fetch(`${API_URL}/admin/badges/${badgeId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchBadges()
      }
    } catch (error) {
      console.error('Error updating badge status:', error)
    }
  }

  const filteredBadges = badges.filter(badge => {
    const matchesDomain = !filterDomain || badge.domain === filterDomain
    const matchesStatus = !filterStatus || badge.status === filterStatus
    return matchesDomain && matchesStatus
  })

  const domains = [...new Set(badges.map(b => b.domain))]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Badges
        </h1>
        <p className="text-gray-600">
          Vue globale de tous les badges créés sur la plateforme
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#AB3500]" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Domaine
            </label>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#AB3500] focus:border-transparent outline-none"
            >
              <option value="">Tous les domaines</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#AB3500] focus:border-transparent outline-none"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="disabled">Désactivé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Badges Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Aucun badge trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Badge</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Domaine</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Formateur</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Attributions</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBadges.map(badge => (
                  <tr key={badge.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#AB3500]/10 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-[#AB3500]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{badge.name}</p>
                          <p className="text-sm text-gray-500">{badge.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {badge.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{badge.issuer.fullName}</p>
                        <p className="text-xs text-gray-500">{badge.issuer.organisation}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-gray-900">{badge.recipientCount}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        badge.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {badge.status === 'active' ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleBadgeStatus(badge.id, badge.status)}
                          className={`p-2 rounded-lg transition ${
                            badge.status === 'active'
                              ? 'hover:bg-red-50 text-red-600'
                              : 'hover:bg-green-50 text-green-600'
                          }`}
                        >
                          {badge.status === 'active' ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
