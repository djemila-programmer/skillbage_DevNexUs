'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Award, Calendar, User, Shield, Copy, ExternalLink, CheckCircle, Star } from 'lucide-react'

export default function BadgeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const badgeId = params.id as string
  
  const [badge, setBadge] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadBadge()
  }, [badgeId])

  const loadBadge = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const badges = await response.json()
      const foundBadge = badges.find((b: any) => b.id === badgeId)
      
      if (foundBadge) {
        setBadge(foundBadge)
      }
    } catch (error) {
      console.error('Error loading badge:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getNiveauColor = (niveau: string) => {
    switch (niveau?.toLowerCase()) {
      case 'debutant':
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'intermediaire':
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'expert':
      case 'advanced':
      case 'avance':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getNiveauLabel = (niveau: string) => {
    switch (niveau?.toLowerCase()) {
      case 'debutant':
      case 'beginner':
        return 'Débutant'
      case 'intermediaire':
      case 'intermediate':
        return 'Intermédiaire'
      case 'expert':
      case 'advanced':
      case 'avance':
        return 'Expert'
      default:
        return niveau || 'Non défini'
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Date non disponible'
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du badge...</p>
        </div>
      </div>
    )
  }

  if (!badge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge non trouvé</h2>
          <p className="text-gray-600 mb-6">Ce badge n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-4">
      {/* Content */}
      <div className="w-full max-w-2xl">
        
        {/* Retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span className="text-sm">Retour</span>
        </button>

        {/* Single Certificate Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200">
          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>
          
          <div className="p-6">
            {/* Logo/Brand */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">SKILL</span>
                <span className="text-xl font-black text-orange-600 tracking-tight">BADGE</span>
              </div>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto"></div>
            </div>

            {/* Badge Name */}
            <div className="text-center mb-4">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mb-1">
                Certification
              </p>
              <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                {badge.name}
              </h2>
              {badge.domaine && (
                <p className="text-xs text-slate-600 font-medium">
                  {badge.domaine}
                </p>
              )}
            </div>

            {/* Medal/Badge Visual */}
            <div className="text-center mb-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-orange-100">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold border shadow-sm ${getNiveauColor(badge.niveau)}`}>
                    {getNiveauLabel(badge.niveau)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 text-center">
                Décerné à
              </p>
              <p className="text-lg font-bold text-slate-900 text-center">
                {badge.recipientName || 'Apprenant'}
              </p>
            </div>

            {/* Description */}
            {badge.description && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 text-center">
                  Compétence
                </p>
                <p className="text-xs text-slate-700 leading-relaxed text-center line-clamp-2">
                  {badge.description}
                </p>
              </div>
            )}

            {/* Skills/Criteria */}
            {badge.skills && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Critères validés
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {Array.isArray(badge.skills) 
                    ? badge.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-[10px] font-semibold border border-slate-200">
                          {skill}
                        </span>
                      ))
                    : badge.skills.split(',').slice(0, 3).map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-[10px] font-semibold border border-slate-200">
                          {skill.trim()}
                        </span>
                      ))
                  }
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-3"></div>

            {/* Issuer Info */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-bold text-sm">
                    {(badge.issuerOrganisation || 'I')?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">{badge.issuerOrganisation || 'Institut de formation'}</p>
                  <p className="text-[10px] text-blue-600 font-semibold">✓ Institut certifié</p>
                </div>
              </div>
              {badge.note && (
                <div className="mt-2 bg-slate-50 rounded-lg p-2 border border-slate-200">
                  <p className="text-[10px] text-slate-700 italic text-center line-clamp-2">"{badge.note}"</p>
                </div>
              )}
            </div>

            {/* Date & Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-center">
                <Calendar className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Date</p>
                <p className="text-xs font-bold text-slate-900">
                  {new Date(badge.issuedAt || badge.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 text-center">
                <Shield className="w-4 h-4 text-green-600 mx-auto mb-1" />
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Statut</p>
                <p className="text-xs font-bold text-green-600">Vérifié ✓</p>
              </div>
            </div>

            {/* Blockchain Proof */}
            {badge.transactionHash && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Blockchain
                </p>
                <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                  <p className="text-[10px] font-mono text-slate-700 truncate">
                    {badge.transactionHash}
                  </p>
                  {badge.tokenId && (
                    <p className="text-xs font-mono font-bold text-slate-900 mt-1 text-center">
                      #{badge.tokenId}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 font-bold transition shadow text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier
                  </>
                )}
              </button>

              {badge.transactionHash && (
                <a
                  href={`https://mumbai.polygonscan.com/tx/${badge.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold transition shadow text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  Polygon
                </a>
              )}
            </div>
          </div>

          {/* Bottom accent bar */}
          <div className="h-2 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
        </div>
      </div>
    </div>
  )
}
