'use client'

import { Award, Users, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, BarChart3, Activity, Clock } from 'lucide-react'
import { useState } from 'react'

export default function StatistiquesFormateur() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Données simulées
  const stats = {
    totalBadges: 160,
    activeTalents: 32,
    issuedThisMonth: 24,
    growthRate: 12,
    topBadge: { name: 'React.js Developer', count: 45 },
    completionRate: 87
  }

  const monthlyData = [
    { month: 'Jan', badges: 12, talents: 8 },
    { month: 'Fév', badges: 19, talents: 12 },
    { month: 'Mar', badges: 15, talents: 10 },
    { month: 'Avr', badges: 22, talents: 15 },
    { month: 'Mai', badges: 28, talents: 18 },
    { month: 'Juin', badges: 24, talents: 16 },
  ]

  const recentActivities = [
    { id: 1, action: 'Badge attribué', user: 'Moussa Traoré', badge: 'React.js Developer', date: 'Il y a 2 heures', type: 'success' },
    { id: 2, action: 'Nouveau badge créé', user: 'Vous', badge: 'TypeScript Avancé', date: 'Il y a 5 heures', type: 'info' },
    { id: 3, action: 'Badge attribué', user: 'Fatou Diallo', badge: 'UX Design', date: 'Il y a 1 jour', type: 'success' },
    { id: 4, action: 'Badge révoqué', user: 'Jean Diop', badge: 'Node.js Basics', date: 'Il y a 2 jours', type: 'warning' },
    { id: 5, action: 'Badge attribué', user: 'Awa Ouédraogo', badge: 'Flutter / Dart', date: 'Il y a 3 jours', type: 'success' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de Bord Analytique
        </h1>
        <p className="text-sm text-gray-600">
          Vue d'ensemble des performances de certification - Données immuables de la blockchain.
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        <button 
          onClick={() => setPeriod('week')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition ${
            period === 'week' 
              ? 'bg-[#AB3500] text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cette semaine
        </button>
        <button 
          onClick={() => setPeriod('month')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition ${
            period === 'month' 
              ? 'bg-[#AB3500] text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Ce mois
        </button>
        <button 
          onClick={() => setPeriod('year')}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition ${
            period === 'year' 
              ? 'bg-[#AB3500] text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cette année
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              BADGES ÉMIS
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-[#AB3500]" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalBadges}</div>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-semibold">+{stats.growthRate}%</span>
            <span className="text-gray-500">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              TALENTS ACTIFS
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.activeTalents}</div>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-semibold">+8</span>
            <span className="text-gray-500">nouveaux ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              ÉMIS CE MOIS
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.issuedThisMonth}</div>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-semibold">+15%</span>
            <span className="text-gray-500">vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              TAUX COMPLÉTION
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">{stats.completionRate}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column - Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Évolution des émissions
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#AB3500] rounded-full"></div>
                  <span className="text-gray-600">Badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Talents</span>
                </div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-xs font-semibold text-gray-500">{data.month}</div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div 
                        className="h-8 bg-gradient-to-r from-[#AB3500] to-orange-400 rounded-lg transition-all"
                        style={{ width: `${(data.badges / 30) * 100}%` }}
                      >
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                          {data.badges}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 relative">
                      <div 
                        className="h-8 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg transition-all"
                        style={{ width: `${(data.talents / 20) * 100}%` }}
                      >
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                          {data.talents}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Badge */}
          <div className="bg-gradient-to-br from-[#AB3500] to-orange-800 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Badge le plus populaire</h3>
              <Award className="w-8 h-8 text-orange-200" />
            </div>
            <div className="text-4xl font-bold mb-2">{stats.topBadge.name}</div>
            <div className="flex items-center gap-2 text-orange-100">
              <Users className="w-5 h-5" />
              <span>{stats.topBadge.count} talents certifiés</span>
            </div>
          </div>
        </div>

        {/* Right Column - Activity History */}
        <div className="space-y-6">
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Activité récente
              </h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">{activity.action}</span>
                      <span className="text-[10px] text-gray-400">{activity.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {activity.user} • {activity.badge}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition">
              Voir tout l'historique
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Résumé rapide
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Moyenne badges/mois</span>
                <span className="text-sm font-bold text-gray-900">20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Meilleur mois</span>
                <span className="text-sm font-bold text-green-600">Mai (28)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Catégorie top</span>
                <span className="text-sm font-bold text-[#AB3500]">Développement</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Taux rétention</span>
                <span className="text-sm font-bold text-blue-600">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
