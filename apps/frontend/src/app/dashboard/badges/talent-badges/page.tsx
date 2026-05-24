'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Calendar, Award, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface Badge {
  id: string
  name: string
  description: string
  skills: string | string[]
  niveau: string
  status: string
  issuedAt: string
  issuer: {
    fullName: string
  }
}

export default function MesBadges() {
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

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'debutant':
      case 'beginner':
        return 'bg-gray-100 text-gray-600'
      case 'intermediaire':
      case 'intermediate':
        return 'bg-blue-100 text-blue-700'
      case 'avance':
      case 'advanced':
      case 'expert':
        return 'bg-orange-900 text-white'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Chargement des badges...</div>
      </div>
    )
  }

  const totalBadges = badges.length
  const activeBadges = badges.filter(b => b.status === 'active').length
  const uniqueSkills = new Set(
    badges.flatMap(b => Array.isArray(b.skills) ? b.skills : b.skills?.split(',') || [])
  ).size

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mes Badges
        </h1>
        <p className="text-sm text-gray-600">
          Historique des certifications et vérifications de compétences.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            TOTAL BADGES
          </div>
          <div className="text-3xl font-bold" style={{ color: '#AB3500' }}>{totalBadges}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            BADGES ACTIFS
          </div>
          <div className="text-3xl font-bold text-blue-600">{activeBadges}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            COMPÉTENCES
          </div>
          <div className="text-3xl font-bold text-green-600">{uniqueSkills}</div>
        </div>
      </div>

      {/* Badges List */}
      {badges.length === 0 ? (
        <div className="text-center py-20">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de badges.</p>
          <p className="text-sm text-gray-400">Les badges vous seront attribués par vos formateurs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {badges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => router.push(`/dashboard/badges/${badge.id}`)}
              className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex items-center justify-between group text-left"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#AB35001A' }}>
                  <Shield className="w-6 h-6" style={{ color: '#AB3500' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900">{badge.name}</h3>
                    <span className={`px-3 py-1 rounded-md text-xs font-semibold ${getLevelColor(badge.niveau)}`}>
                      {badge.niveau?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(Array.isArray(badge.skills) ? badge.skills.slice(0, 3) : badge.skills?.split(',').slice(0, 3) || []).map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(badge.issuedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {badge.issuer?.fullName}
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-900 transition" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
