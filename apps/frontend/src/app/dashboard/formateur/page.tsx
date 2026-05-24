'use client'

import { Award, Users, XCircle, TrendingUp, Plus, FileText, Search, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface Badge {
  id: string
  name: string
  description: string
  skills: string
  niveau?: string
  competencyLevel?: string
  status: string
  issuedAt?: string
  createdAt?: string
  recipient?: {
    fullName: string
    email: string
  }
}

export default function DashboardFormateur() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

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
        setBadges(data)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const userName = user?.fullName || user?.email?.split('@')[0] || 'Formateur'
  const activeBadges = badges.filter(b => b.status === 'active')
  const totalRecipients = new Set(badges.map(b => b.recipient?.email)).size

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Bienvenu,
          </h1>
          <h2 className="text-4xl font-extrabold text-[#AB3500] mb-2">
            {userName} !
          </h2>
          <p className="text-sm text-gray-600">
            Gestion des accréditations et suivi des compétences.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            BADGES ÉMIS
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {loading ? '...' : badges.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            TALENTS CERTIFIÉS
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {loading ? '...' : totalRecipients}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            BADGES ACTIFS
          </div>
          <div className="text-4xl font-bold text-green-600">
            {loading ? '...' : activeBadges.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            TOP BADGE
          </div>
          <div className="font-bold text-gray-900 mb-1">
            {loading ? '...' : (badges.length > 0 ? badges[0].name.split(' ')[0] : 'Aucun')}
          </div>
          <div className="text-xs text-gray-500">Le plus décerné</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dernières Certifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Dernières Certifications
              </h3>
              <Link href="/dashboard/badges" className="text-[#AB3500] text-xs font-semibold hover:underline">
                Voir tout
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Chargement...</p>
              </div>
            ) : badges.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucune certification émise</p>
                <Link 
                  href="/dashboard/attribute-badge"
                  className="inline-block mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold"
                >
                  Émettre un badge
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {badges.slice(0, 5).map((badge) => (
                  <div 
                    key={badge.id} 
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => router.push(`/dashboard/badges/${badge.id}`)}
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">
                        {badge.recipient?.fullName || 'Apprenant'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {badge.name} • {badge.niveau || badge.competencyLevel || 'N/A'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {badge.issuedAt || badge.createdAt ? new Date((badge.issuedAt || badge.createdAt) as string).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      }) : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historique des actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Historique des actions
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un étudiant..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#AB3500]/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200">
                    <th className="text-left pb-3">Étudiant</th>
                    <th className="text-left pb-3">Badge</th>
                    <th className="text-left pb-3">Date</th>
                    <th className="text-left pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          MB
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Moussa Bah</div>
                          <div className="text-xs text-gray-500">ID: #49201</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#AB3500]" />
                        <span className="font-medium text-gray-900">Développeur Fullstack</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">24 Oct 2023</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        VALIDÉ
                      </span>
                    </td>
                  </tr>

                  <tr className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          AS
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Awa Sow</div>
                          <div className="text-xs text-gray-500">ID: #49202</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#AB3500]" />
                        <span className="font-medium text-gray-900">Agri-Tech Manager</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">23 Oct 2023</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                        EN COURS
                      </span>
                    </td>
                  </tr>

                  <tr className="text-sm">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#AB3500] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          JD
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Jean Diop</div>
                          <div className="text-xs text-gray-500">ID: #49203</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#AB3500]" />
                        <span className="font-medium text-gray-900">Expert Solaire</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">22 Oct 2023</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        VALIDÉ
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-center">
              <Link href="/dashboard/history" className="text-blue-600 text-sm font-semibold hover:underline inline-flex items-center gap-1">
                Voir tout l'historique
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          
          {/* Quick Issuance */}
          <div className="bg-[#F0F0F0] rounded-2xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Quick Issuance
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard/create-badge" className="w-full p-4 bg-white rounded-xl flex items-center gap-3 hover:shadow-md transition block">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Emettre nouveau Badge
                </span>
              </Link>
              <Link href="/dashboard/statistics" className="w-full p-4 bg-white rounded-xl flex items-center gap-3 hover:shadow-md transition block">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Statistiques
                </span>
              </Link>
            </div>
          </div>

          {/* Authenticité Score */}
          <div className="bg-[#AB3500] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10">
              <Award className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1">
                Authenticité Score
              </h3>
              <p className="text-xs text-orange-200 mb-4 uppercase tracking-wider">
                INSTITUTION VERIFIER
              </p>
              <div className="text-4xl font-bold mb-3">98.8%</div>
              <p className="text-sm text-orange-100 leading-relaxed mb-4">
                Votre certification records are 100% compliant with the National Skill Trust protocol.
              </p>
              <div className="pt-4 border-t border-white/20">
                <p className="text-xs text-orange-200">
                  MISE A JOUR: OCT 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
