'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Award, MapPin, Mail, ExternalLink, Calendar, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function RecruiterPortfolioView() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthStore()
  
  const talentId = searchParams.get('id')
  const [talent, setTalent] = useState<any>(null)
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)

  useEffect(() => {
    if (talentId) {
      loadPortfolio()
    }
  }, [talentId])

  const loadPortfolio = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')

      // Charger le talent
      const response = await fetch(`${API_URL}/users/${talentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setTalent(userData)

        // Charger les badges
        const badgesResponse = await fetch(`${API_URL}/badges/user/${talentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (badgesResponse.ok) {
          const badgesData = await badgesResponse.json()
          setBadges(badgesData)
        }
      }
    } catch (error) {
      console.error('Erreur chargement portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Talent non trouvé</p>
        <Link
          href="/dashboard/recruteur"
          className="mt-4 inline-block px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Retour au dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {talent.fullName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{talent.fullName}</h1>
            {talent.city && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                {talent.city}
              </div>
            )}
            {talent.objective && (
              <p className="text-gray-700">{talent.objective}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{badges.length}</p>
            <p className="text-sm text-gray-600 mt-1">Badges obtenus</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {new Set(badges.map(b => b.domain || b.name?.split(' ')[0])).size}
            </p>
            <p className="text-sm text-gray-600 mt-1">Domaines</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {new Set(badges.map(b => b.issuer?.fullName || b.issuer)).size}
            </p>
            <p className="text-sm text-gray-600 mt-1">Formateurs</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Tous les badges ({badges.length})
        </h2>

        {badges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun badge obtenu</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedBadge(badge)}
                className="p-6 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Award className="w-8 h-8 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                    {badge.niveau && (
                      <span className="inline-block text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {badge.niveau}
                      </span>
                    )}
                  </div>
                </div>

                {badge.issuedAt && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(badge.issuedAt).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Détails du badge
              </h2>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">
                  {selectedBadge.name}
                </h3>
                {selectedBadge.description && (
                  <p className="text-gray-600">{selectedBadge.description}</p>
                )}
              </div>

              {selectedBadge.niveau && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Niveau</p>
                  <p className="text-lg font-bold text-blue-700">{selectedBadge.niveau}</p>
                </div>
              )}

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

              {selectedBadge.issuer && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Émis par</p>
                  <p className="text-gray-900 font-medium">
                    {typeof selectedBadge.issuer === 'string' 
                      ? selectedBadge.issuer 
                      : selectedBadge.issuer.fullName || selectedBadge.issuer.name}
                  </p>
                </div>
              )}

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
    </div>
  )
}
