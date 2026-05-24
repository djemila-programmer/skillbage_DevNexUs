'use client'

import { useParams, useRouter } from 'next/navigation'
import { Award, MapPin, Calendar, Shield, Bookmark, ArrowLeft, ExternalLink, CheckCircle, XCircle, Globe, Link } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface Badge {
  id: string
  name: string
  description: string
  niveau: string
  domain: string
  issuer: {
    fullName: string
    organisation?: string
  }
  issuedAt: string
  status: 'active' | 'revoked'
  tokenId?: string
}

interface Talent {
  id: string
  fullName: string
  email: string
  city?: string
  domains?: string
  objective?: string
  github?: string
  linkedin?: string
  badges: Badge[]
  totalBadges: number
  uniqueDomains: number
  uniqueIssuers: number
}

export default function CandidateProfile() {
  const params = useParams()
  const router = useRouter()
  const talentId = params.id as string
  const { user } = useAuthStore()
  
  const [talent, setTalent] = useState<Talent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    fetchTalent()
  }, [talentId])

  const fetchTalent = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/users/${talentId}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTalent(data)
      }
    } catch (error) {
      console.error('Error fetching talent:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil non trouvé</h2>
        <p className="text-gray-600 mb-6">Ce profil n'existe pas ou a été supprimé</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-[#AB3500] text-white rounded-lg font-semibold hover:bg-[#8B3103] transition"
        >
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-[#AB3500] transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la recherche
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-orange-900">
                {talent.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{talent.fullName}</h1>
              {talent.city && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  {talent.city}
                </div>
              )}
              {talent.objective && (
                <p className="text-gray-600">{talent.objective}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                isSaved 
                  ? 'bg-[#AB3500] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {/* Links */}
        {(talent.github || talent.linkedin) && (
          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
            {talent.github && (
              <a
                href={talent.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-[#AB3500] transition"
              >
                <Globe className="w-5 h-5" />
                GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {talent.linkedin && (
              <a
                href={talent.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-[#AB3500] transition"
              >
                <Link className="w-5 h-5" />
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            CERTIFICATIONS
          </div>
          <div className="text-4xl font-bold text-gray-900">{talent.totalBadges}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            DOMAINES
          </div>
          <div className="text-4xl font-bold text-gray-900">{talent.uniqueDomains}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-green-500">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            FORMATEURS
          </div>
          <div className="text-4xl font-bold text-gray-900">{talent.uniqueIssuers}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Certifications ({talent.badges.length})
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {talent.badges.map(badge => (
            <div key={badge.id} className="border border-gray-200 rounded-xl p-6 hover:border-[#AB3500] transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#AB3500]/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-[#AB3500]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-500">{badge.domain}</p>
                  </div>
                </div>
                {badge.status === 'active' ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Validé</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Révoqué</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{badge.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-500">Émis par <span className="font-semibold text-gray-900">{badge.issuer.fullName}</span></p>
                  {badge.issuer.organisation && (
                    <p className="text-gray-500">{badge.issuer.organisation}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">
                    {badge.niveau}
                  </span>
                  <p className="text-gray-500 flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3" />
                    {new Date(badge.issuedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {badge.tokenId && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`https://mumbai.polygonscan.com/token/${badge.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#AB3500] text-sm font-semibold hover:underline"
                  >
                    <Shield className="w-4 h-4" />
                    Voir sur Blockchain
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
