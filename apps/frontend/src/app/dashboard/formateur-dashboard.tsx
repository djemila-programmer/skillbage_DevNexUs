'use client'

import { Award, Users, TrendingUp, Calendar, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface Badge {
  id: string
  name: string
  niveau: string
  issuedAt: string
  recipientName: string
  recipientId: string
  issuerId: string
}

export default function DashboardFormateur() {
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBadges: 0,
    totalLearners: 0,
    mostIssuedBadge: '',
    badgesThisMonth: 0
  })

  useEffect(() => {
    fetchBadges()
  }, [user?.id])

  const fetchBadges = async () => {
    if (!user?.id) return
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const allBadges = await response.json()
        // Filtrer les badges émis par ce formateur
        const myBadges = allBadges.filter((b: any) => b.issuerId === user.id) as Badge[]
        setBadges(myBadges)
        calculateStats(myBadges)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (badges: Badge[]) => {
    // Total badges
    const totalBadges = badges.length

    // Total apprenants uniques
    const uniqueLearners = new Set(badges.map(b => b.recipientId))
    const totalLearners = uniqueLearners.size

    // Badge le plus attribué
    const badgeCount: Record<string, number> = {}
    badges.forEach(b => {
      badgeCount[b.name] = (badgeCount[b.name] || 0) + 1
    })
    const mostIssuedBadge = Object.entries(badgeCount)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Aucun'

    // Badges ce mois-ci
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const badgesThisMonth = badges.filter(b => {
      const issuedDate = new Date(b.issuedAt)
      return issuedDate.getMonth() === thisMonth && issuedDate.getFullYear() === thisYear
    }).length

    setStats({
      totalBadges,
      totalLearners,
      mostIssuedBadge,
      badgesThisMonth
    })
  }

  const getNiveauColor = (niveau: string) => {
    switch (niveau?.toLowerCase()) {
      case 'expert':
      case 'avance':
        return 'bg-purple-100 text-purple-700'
      case 'intermediaire':
        return 'bg-blue-100 text-blue-700'
      case 'debutant':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const userName = user?.fullName || user?.email?.split('@')[0] || 'Formateur'

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, <span className="text-[#AB3500]">{userName}</span>
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Voici un aperçu de votre activité de certification
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Badges */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-[#AB3500]">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-[#AB3500]" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats.totalBadges}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Badges Émis
          </div>
        </div>

        {/* Total Apprenants */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats.totalLearners}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Apprenants Certifiés
          </div>
        </div>

        {/* Badge le plus attribué */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
            {loading ? '...' : stats.mostIssuedBadge}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Badge le Plus Attribué
          </div>
        </div>

        {/* Badges ce mois-ci */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats.badgesThisMonth}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ce Mois-ci
          </div>
        </div>
      </div>

      {/* Dernières Certifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Dernières Certifications
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : badges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune certification</h3>
            <p className="text-sm text-gray-500">
              Vous n'avez pas encore émis de badges. Commencez par attribuer un badge à un apprenant.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {badges
              .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
              .slice(0, 5)
              .map((badge) => (
                <div 
                  key={badge.id} 
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  {/* Avatar Apprenant */}
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {badge.recipientName?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {badge.recipientName || 'Apprenant'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {badge.name}
                    </p>
                  </div>

                  {/* Niveau */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNiveauColor(badge.niveau)}`}>
                    {badge.niveau === 'avance' ? 'Avancé' : badge.niveau === 'intermediaire' ? 'Intermédiaire' : badge.niveau === 'debutant' ? 'Débutant' : badge.niveau}
                  </span>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-gray-500 text-sm flex-shrink-0">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(badge.issuedAt)}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
