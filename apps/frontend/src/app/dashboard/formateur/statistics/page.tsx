'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function FormateurStatistics() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBadges: 0,
    totalLearners: 0,
    badgesThisMonth: 0,
    domainDistribution: {} as Record<string, number>,
    levelDistribution: {} as Record<string, number>,
    monthlyEvolution: [] as any[],
    topBadges: [] as any[],
  })

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (!token || !storedUser) {
      router.push('/auth/login-formateur')
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== 'formateur') {
      router.push('/dashboard')
      return
    }

    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/badges')
      const allBadges = await response.json()
      
      // Filtrer les badges émis par ce formateur
      const formateurBadges = allBadges.filter(
        (b: any) => b.issuerId === user?.id || b.issuer?.id === user?.id
      )
      
      setBadges(formateurBadges)

      // Calculer les statistiques
      const now = new Date()
      const thisMonth = formateurBadges.filter((b: any) => {
        const issuedAt = new Date(b.issuedAt)
        return issuedAt.getMonth() === now.getMonth() && 
               issuedAt.getFullYear() === now.getFullYear()
      })

      // Distribution par domaine
      const domainDist: Record<string, number> = {}
      formateurBadges.forEach((b: any) => {
        const domain = b.domain || 'Non catégorisé'
        domainDist[domain] = (domainDist[domain] || 0) + 1
      })

      // Distribution par niveau
      const levelDist: Record<string, number> = {}
      formateurBadges.forEach((b: any) => {
        const level = b.niveau || 'Non spécifié'
        levelDist[level] = (levelDist[level] || 0) + 1
      })

      // Évolution mensuelle (6 derniers mois)
      const monthlyEvo = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthBadges = formateurBadges.filter((b: any) => {
          const issuedAt = new Date(b.issuedAt)
          return issuedAt.getMonth() === date.getMonth() && 
                 issuedAt.getFullYear() === date.getFullYear()
        })
        monthlyEvo.push({
          month: date.toLocaleDateString('fr-FR', { month: 'short' }),
          count: monthBadges.length
        })
      }

      // Top 5 badges
      const badgeCount: Record<string, number> = {}
      formateurBadges.forEach((b: any) => {
        const name = b.name || 'Badge sans nom'
        badgeCount[name] = (badgeCount[name] || 0) + 1
      })
      const topBadges = Object.entries(badgeCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

      // Nombre d'apprenants uniques
      const uniqueLearners = new Set(formateurBadges.map((b: any) => b.recipientId)).size

      setStats({
        totalBadges: formateurBadges.length,
        totalLearners: uniqueLearners,
        badgesThisMonth: thisMonth.length,
        domainDistribution: domainDist,
        levelDistribution: levelDist,
        monthlyEvolution: monthlyEvo,
        topBadges,
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  const maxMonthly = Math.max(...stats.monthlyEvolution.map(m => m.count), 1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Statistiques</h1>
            <button 
              onClick={() => router.push('/dashboard/formateur')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Analyse de vos certifications
          </h2>
          <p className="text-gray-600">
            Suivez l'évolution de votre activité de formation
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalBadges}
            </div>
            <div className="text-sm text-gray-600">Total badges émis</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalLearners}
            </div>
            <div className="text-sm text-gray-600">Apprenants certifiés</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.badgesThisMonth}
            </div>
            <div className="text-sm text-gray-600">Ce mois-ci</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {Object.keys(stats.domainDistribution).length}
            </div>
            <div className="text-sm text-gray-600">Domaines couverts</div>
          </div>
        </div>

        {/* Monthly Evolution Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Évolution mensuelle</h3>
          </div>
          
          <div className="flex items-end gap-4 h-64">
            {stats.monthlyEvolution.map((month, index) => {
              const height = (month.count / maxMonthly) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-bold text-gray-900">{month.count}</div>
                  <div 
                    className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <div className="text-xs text-gray-600 font-semibold">{month.month}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Domain & Level Distribution */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* By Domain */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Par domaine</h3>
            <div className="space-y-4">
              {Object.entries(stats.domainDistribution).map(([domain, count]) => {
                const percentage = Math.round((count / stats.totalBadges) * 100)
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">{domain}</span>
                      <span className="text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* By Level */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Par niveau</h3>
            <div className="space-y-4">
              {Object.entries(stats.levelDistribution).map(([level, count]) => {
                const percentage = Math.round((count / stats.totalBadges) * 100)
                return (
                  <div key={level}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">{level}</span>
                      <span className="text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top 5 Badges */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top 5 compétences certifiées</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.topBadges.map((badge, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">#{index + 1}</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">{badge.name}</div>
                <div className="text-xs text-gray-600">{badge.count} certifications</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
