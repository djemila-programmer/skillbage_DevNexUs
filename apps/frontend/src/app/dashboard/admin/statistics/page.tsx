'use client'

import { BarChart3, TrendingUp, Award, Users, MapPin, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export default function AdminStatistics() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => setLoading(false), 1000)
  }, [])

  // Données simulées (à remplacer par API)
  const stats = {
    badgesByDomain: [
      { domain: 'Développement Web', count: 145 },
      { domain: 'Développement Mobile', count: 89 },
      { domain: 'Design UI/UX', count: 67 },
      { domain: 'Data & IA', count: 34 },
      { domain: 'Cybersécurité', count: 28 },
    ],
    topTrainers: [
      { name: 'Tech Academy', badges: 89 },
      { name: 'Digital Campus', badges: 67 },
      { name: 'Code Institute', badges: 54 },
      { name: 'Formation Pro', badges: 43 },
      { name: 'Savane Tech', badges: 38 },
    ],
    topSkills: [
      { skill: 'React.js', count: 123 },
      { skill: 'Node.js', count: 98 },
      { skill: 'Flutter', count: 76 },
      { skill: 'Figma', count: 65 },
      { skill: 'Python', count: 54 },
    ],
    geographicDistribution: {
      ouagadougou: 234,
      boboDioulasso: 89,
      other: 145,
    },
    monthlyRegistrations: [
      { month: 'Jan', learners: 45, trainers: 8 },
      { month: 'Fév', learners: 67, trainers: 12 },
      { month: 'Mar', learners: 89, trainers: 15 },
      { month: 'Avr', learners: 123, trainers: 18 },
      { month: 'Mai', learners: 156, trainers: 22 },
      { month: 'Juin', learners: 189, trainers: 25 },
    ]
  }

  const maxDomainCount = Math.max(...stats.badgesByDomain.map(d => d.count))
  const maxTrainerCount = Math.max(...stats.topTrainers.map(t => t.badges))
  const maxSkillCount = Math.max(...stats.topSkills.map(s => s.count))
  const maxLearnerCount = Math.max(...stats.monthlyRegistrations.map(m => m.learners))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Statistiques Globales
        </h1>
        <p className="text-gray-600">
          Suivi de la santé de la plateforme dans son ensemble
        </p>
      </div>

      {/* Badges by Domain */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-[#AB3500]" />
          <h2 className="text-xl font-bold text-gray-900">
            Répartition des badges par domaine
          </h2>
        </div>

        <div className="space-y-4">
          {stats.badgesByDomain.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-40 text-sm font-semibold text-gray-700">{item.domain}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-[#AB3500] rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${(item.count / maxDomainCount) * 100}%` }}
                >
                  <span className="text-xs font-bold text-white">{item.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Trainers & Top Skills */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top 10 Formateurs */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Top 10 des formateurs les plus actifs
            </h2>
          </div>

          <div className="space-y-3">
            {stats.topTrainers.map((trainer, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{trainer.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{trainer.badges} badges</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Compétences */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Top 10 des compétences les plus certifiées
            </h2>
          </div>

          <div className="space-y-3">
            {stats.topSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-900">{skill.skill}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{skill.count} certifs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Répartition géographique des apprenants
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-orange-50 rounded-xl">
            <Globe className="w-8 h-8 text-[#AB3500] mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.geographicDistribution.ouagadougou}</p>
            <p className="text-sm text-gray-600">Ouagadougou</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.geographicDistribution.boboDioulasso}</p>
            <p className="text-sm text-gray-600">Bobo-Dioulasso</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.geographicDistribution.other}</p>
            <p className="text-sm text-gray-600">Autres villes</p>
          </div>
        </div>
      </div>

      {/* Monthly Registrations */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Évolution mensuelle des inscriptions
          </h2>
        </div>

        <div className="flex items-end justify-between gap-2 h-64">
          {stats.monthlyRegistrations.map((month, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-blue-600">{month.learners}</span>
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(month.learners / maxLearnerCount) * 150}px` }}
                ></div>
                <div
                  className="w-full bg-teal-400 rounded-b-lg transition-all duration-500"
                  style={{ height: `${(month.trainers / maxLearnerCount) * 150}px` }}
                ></div>
                <span className="text-xs font-bold text-teal-600">{month.trainers}</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">{month.month}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Apprenants</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-teal-400 rounded"></div>
            <span className="text-sm text-gray-600">Formateurs</span>
          </div>
        </div>
      </div>
    </div>
  )
}
