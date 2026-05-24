'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Shield, Users, Award, CheckCircle, XCircle, Eye, BarChart3, TrendingUp, MapPin, Activity } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PendingFormateur {
  id: string
  fullName: string
  email: string
  organization: string
  domaineExpertise: string
  description: string
  justificatif?: string
  createdAt: string
}

interface Badge {
  id: string
  name: string
  domaine: string
  issuerName: string
  issuerId: string
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [token, setToken] = useState<string | null>(null)
  const [activePage, setActivePage] = useState<'dashboard' | 'formateurs' | 'badges' | 'statistics'>('dashboard')

  // Dashboard State
  const [stats, setStats] = useState({
    formateursActifs: 0,
    apprenantsInscrits: 0,
    badgesTotal: 0,
    badgesSemaine: 0,
    pendingRequests: 0
  })

  // Formateurs State
  const [pendingFormateurs, setPendingFormateurs] = useState<PendingFormateur[]>([])
  const [activeFormateurs, setActiveFormateurs] = useState<any[]>([])
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedFormateur, setSelectedFormateur] = useState<string>('')
  const [rejectReason, setRejectReason] = useState('')

  // Badges State
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [filterDomaine, setFilterDomaine] = useState('')
  const [filterFormateur, setFilterFormateur] = useState('')

  // Stats State
  const [domainStats, setDomainStats] = useState<any[]>([])
  const [topFormateurs, setTopFormateurs] = useState<any[]>([])
  const [topCompetences, setTopCompetences] = useState<any[]>([])
  const [badgeEvolution, setBadgeEvolution] = useState<any[]>([])
  const [registrationEvolution, setRegistrationEvolution] = useState<any[]>([])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/auth/login-formateur')
    } else {
      setToken(storedToken)
    }
  }, [router])

  useEffect(() => {
    if (token) {
      fetchAllData()
    }
  }, [token])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  const fetchAllData = async () => {
    if (!token) return

    try {
      // Fetch all users
      const usersResponse = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (usersResponse.ok) {
        const users = await usersResponse.json()
        const formateurs = users.filter((u: any) => u.role === 'formateur')
        const talents = users.filter((u: any) => u.role === 'talent')
        
        console.log('Total utilisateurs:', users.length)
        console.log('Total formateurs:', formateurs.length)
        console.log('Formateurs en attente:', formateurs.filter((f: any) => f.status === 'pending').length)
        console.log('Formateurs approuvés:', formateurs.filter((f: any) => f.status === 'approved').length)
        console.log('Formateurs sans status:', formateurs.filter((f: any) => !f.status).length)
        
        setActiveFormateurs(formateurs.filter((f: any) => f.status === 'approved' || !f.status))
        setPendingFormateurs(formateurs.filter((f: any) => f.status === 'pending'))
        
        setStats({
          formateursActifs: formateurs.filter((f: any) => f.status === 'approved' || !f.status).length,
          apprenantsInscrits: talents.length,
          badgesTotal: 0,
          badgesSemaine: 0,
          pendingRequests: formateurs.filter((f: any) => f.status === 'pending').length
        })

        // Évolution des inscriptions sur 6 mois
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
        const registrationData: any[] = []
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          
          const count = users.filter((u: any) => {
            const userDate = new Date(u.createdAt)
            return userDate >= monthStart && userDate <= monthEnd
          }).length
          
          registrationData.push({
            mois: monthNames[date.getMonth()],
            count
          })
        }
        
        setRegistrationEvolution(registrationData)
      }

      // Fetch all badges
      const badgesResponse = await fetch(`${API_URL}/badges`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (badgesResponse.ok) {
        const badges = await badgesResponse.json()
        setAllBadges(badges)
        
        const thisWeek = new Date()
        thisWeek.setDate(thisWeek.getDate() - 7)
        const badgesThisWeek = badges.filter((b: any) => new Date(b.createdAt) >= thisWeek)
        
        setStats(prev => ({
          ...prev,
          badgesTotal: badges.length,
          badgesSemaine: badgesThisWeek.length
        }))

        // Calculer l'évolution sur 6 mois
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
        const evolutionData: any[] = []
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          
          const count = badges.filter((b: any) => {
            const badgeDate = new Date(b.createdAt)
            return badgeDate >= monthStart && badgeDate <= monthEnd
          }).length
          
          evolutionData.push({
            mois: monthNames[date.getMonth()],
            count
          })
        }
        
        setBadgeEvolution(evolutionData)

        // Domain stats
        const domainCount: any = {}
        badges.forEach((b: any) => {
          const domain = b.domaine || 'Autre'
          domainCount[domain] = (domainCount[domain] || 0) + 1
        })
        setDomainStats(Object.entries(domainCount).map(([name, count]) => ({ name, count })))

        // Top 10 formateurs actifs
        const formateurCount: any = {}
        badges.forEach((b: any) => {
          const issuerName = b.issuerName || 'Inconnu'
          formateurCount[issuerName] = (formateurCount[issuerName] || 0) + 1
        })
        const topFormateursData = Object.entries(formateurCount)
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, count]) => ({ name, count }))
        setTopFormateurs(topFormateursData)

        // Top 10 compétences
        const skillCount: any = {}
        badges.forEach((b: any) => {
          if (b.skills && Array.isArray(b.skills)) {
            b.skills.forEach((skill: string) => {
              skillCount[skill] = (skillCount[skill] || 0) + 1
            })
          }
        })
        const topSkillsData = Object.entries(skillCount)
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, count]) => ({ name, count }))
        setTopCompetences(topSkillsData)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }

  const handleApprove = async (formateurId: string) => {
    try {
      const response = await fetch(`${API_URL}/users/${formateurId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert('Formateur approuvé avec succès')
        fetchAllData()
      }
    } catch (err) {
      console.error('Approve error:', err)
      alert('Erreur lors de l\'approbation')
    }
  }

  const handleReject = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${selectedFormateur}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectReason })
      })

      if (response.ok) {
        alert('Demande refusée')
        setShowRejectModal(false)
        setRejectReason('')
        fetchAllData()
      }
    } catch (err) {
      console.error('Reject error:', err)
      alert('Erreur lors du refus')
    }
  }

  const filteredBadges = allBadges.filter(badge => {
    if (filterDomaine && badge.domaine !== filterDomaine) return false
    if (filterFormateur && badge.issuerName !== filterFormateur) return false
    return true
  })

  const domaines = [...new Set(allBadges.map(b => b.domaine).filter(Boolean))]
  const formateurs = [...new Set(allBadges.map(b => b.issuerName).filter(Boolean))]

  if (!token) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#A04000' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin SkillBadge</h1>
              <p className="text-sm text-gray-500">Équipe interne uniquement</p>
            </div>
          </div>
          <button
            onClick={() => {
              useAuthStore.getState().logout()
              router.push('/')
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            Déconnexion
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-6 mt-6">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
            { id: 'formateurs', label: 'Formateurs', icon: Users },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'statistics', label: 'Statistiques', icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activePage === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activePage === tab.id ? { backgroundColor: '#A04000' } : {}}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Page 5.1 - Dashboard */}
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
            
            {/* Chiffres clés */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Formateurs actifs</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.formateursActifs}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Apprenants inscrits</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.apprenantsInscrits}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Total badges émis</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.badgesTotal}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Cette semaine</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.badgesSemaine}</p>
              </div>
            </div>

            {/* Alerte demandes en attente */}
            {stats.pendingRequests > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">⚠️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-900">{stats.pendingRequests} demande(s) de formateur en attente de validation</p>
                    <button
                      onClick={() => setActivePage('formateurs')}
                      className="text-sm text-yellow-700 underline mt-1"
                    >
                      Voir les demandes →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Graphique évolution 6 mois */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des badges émis (6 mois)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={badgeEvolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="mois" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#A04000" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Page 5.2 - Gestion Formateurs */}
        {activePage === 'formateurs' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des formateurs</h2>
              <button
                onClick={fetchAllData}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>
            
            {/* Demandes en attente */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demandes en attente ({pendingFormateurs.length})</h3>
              
              {pendingFormateurs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Aucune demande en attente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingFormateurs.map(formateur => (
                    <div key={formateur.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{formateur.fullName}</h4>
                          <p className="text-sm text-gray-600">{formateur.email}</p>
                          <p className="text-sm font-medium mt-2" style={{ color: '#A04000' }}>
                            {formateur.organization}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">{formateur.description}</p>
                          <div className="mt-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{formateur.domaineExpertise}</span>
                          </div>
                          {formateur.justificatif && (
                            <a
                              href={formateur.justificatif}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:underline"
                            >
                              <Eye className="w-4 h-4" />
                              Voir le justificatif
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleApprove(formateur.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFormateur(formateur.id)
                              setShowRejectModal(true)
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formateurs actifs */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Formateurs actifs ({activeFormateurs.length})</h3>
              
              {activeFormateurs.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Aucun formateur actif</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Organisation</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeFormateurs.map(formateur => (
                        <tr key={formateur.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{formateur.fullName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{formateur.email}</td>
                          <td className="py-3 px-4 text-sm">{formateur.organization || '-'}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Actif
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="text-sm text-red-600 hover:underline">
                              Suspendre
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page 5.3 - Gestion Badges */}
        {activePage === 'badges' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des badges</h2>
            
            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex gap-4">
                <select
                  value={filterDomaine}
                  onChange={(e) => setFilterDomaine(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Tous les domaines</option>
                  {domaines.map(domaine => (
                    <option key={domaine} value={domaine}>{domaine}</option>
                  ))}
                </select>
                <select
                  value={filterFormateur}
                  onChange={(e) => setFilterFormateur(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Tous les formateurs</option>
                  {formateurs.map(formateur => (
                    <option key={formateur} value={formateur}>{formateur}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tableau badges */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Badge</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Domaine</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Formateur</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBadges.map(badge => (
                    <tr key={badge.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{badge.name}</p>
                          <p className="text-xs text-gray-500">{badge.createdAt ? new Date(badge.createdAt).toLocaleDateString('fr-FR') : '-'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{badge.domaine || '-'}</td>
                      <td className="py-3 px-4 text-sm">{badge.issuerName || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          badge.status === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {badge.status === 'actif' || !badge.status ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-sm text-red-600 hover:underline">
                          Désactiver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBadges.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  Aucun badge trouvé
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page 5.4 - Statistiques */}
        {activePage === 'statistics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistiques globales</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Badges par domaine */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges par domaine</h3>
                {domainStats.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={domainStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {domainStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#A04000', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'][index % 8]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Aucune donnée</p>
                  </div>
                )}
              </div>

              {/* Top 10 formateurs */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 formateurs actifs</h3>
                {topFormateurs.length > 0 ? (
                  <div className="space-y-3">
                    {topFormateurs.map((formateur, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-gray-700">{formateur.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{formateur.count} badges</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Aucune donnée</p>
                  </div>
                )}
              </div>

              {/* Top 10 compétences */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 compétences certifiées</h3>
                {topCompetences.length > 0 ? (
                  <div className="space-y-3">
                    {topCompetences.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                            {idx + 1}
                          </span>
                          <span className="text-sm text-gray-700">{skill.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{skill.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Aucune donnée</p>
                  </div>
                )}
              </div>

              {/* Répartition géographique */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Répartition géographique
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Ouagadougou</span>
                    <span className="font-semibold text-gray-900">--</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Autres villes</span>
                    <span className="font-semibold text-gray-900">--</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Évolution mensuelle des inscriptions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle des inscriptions</h3>
              {registrationEvolution.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationEvolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" name="Inscriptions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Aucune donnée</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Refus */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Motif du refus</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm mb-4"
              rows={4}
              placeholder="Indiquez le motif du refus..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
