'use client'

import { Award, Copy, QrCode, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { QRCodeCanvas } from 'qrcode.react'

interface Badge {
  id: string
  name: string
  description: string
  skills: string
  niveau?: string
  status: string
  issuedAt: string
  issuer?: {
    fullName: string
  }
}

export default function DashboardTalent() {
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    fetchBadges()
    
    // Charger la photo depuis localStorage
    const savedPhoto = localStorage.getItem('userPhotoUrl')
    if (savedPhoto) {
      setProfilePhoto(savedPhoto)
    }
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

  const handleCopy = () => {
    const portfolioUrl = `${window.location.origin}/verify?id=${user?.id}`
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      console.error('Erreur copie:', err)
      // Fallback si clipboard API échoue
      const textArea = document.createElement('textarea')
      textArea.value = portfolioUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `portfolio-${user?.id}-qr.png`
      link.href = url
      link.click()
    }
  }

  const getNiveauBadge = (niveau?: string) => {
    switch (niveau?.toLowerCase()) {
      case 'avance':
        return { label: 'Avancé', color: 'bg-purple-100 text-purple-700' }
      case 'intermediaire':
        return { label: 'Intermédiaire', color: 'bg-blue-100 text-blue-700' }
      case 'debutant':
        return { label: 'Débutant', color: 'bg-green-100 text-green-700' }
      default:
        return { label: 'Intermédiaire', color: 'bg-blue-100 text-blue-700' }
    }
  }

  const userName = user?.fullName || user?.email?.split('@')[0] || 'Utilisateur'

  // Calculer la progression basée sur les niveaux des badges
  const calculateLevelProgress = () => {
    if (!badges || badges.length === 0) {
      return { debutant: 0, intermediaire: 0, expert: 0, total: 0 }
    }

    let debutant = 0
    let intermediaire = 0
    let expert = 0

    badges.forEach(badge => {
      const niveau = badge.niveau?.toLowerCase() || 'intermediaire'
      
      if (niveau === 'debutant' || niveau === 'beginner') {
        debutant++
      } else if (niveau === 'intermediaire' || niveau === 'intermediate') {
        intermediaire++
      } else if (niveau === 'expert' || niveau === 'advanced' || niveau === 'avance') {
        expert++
      }
    })

    // Score pondéré: Débutant=1pt, Intermédiaire=2pts, Expert=3pts
    const score = (debutant * 1) + (intermediaire * 2) + (expert * 3)
    
    // Maximum pour être expert: 15 points (5 badges expert)
    const maxScore = 15
    const progress = Math.min(Math.round((score / maxScore) * 100), 100)

    return { debutant, intermediaire, expert, total: badges.length, score, progress }
  }

  const levelProgress = calculateLevelProgress()

  // Déterminer le niveau actuel
  const getCurrentLevel = () => {
    const expert = levelProgress.expert || 0
    const intermediaire = levelProgress.intermediaire || 0
    const score = levelProgress.score || 0
    
    if (expert >= 3) return 'Expert'
    if (intermediaire >= 2 || score >= 6) return 'Intermédiaire'
    return 'Débutant'
  }

  const currentLevel = getCurrentLevel()
  const badgesNeededForExpert = Math.max(0, 5 - levelProgress.expert)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Section + Profile + Portfolio Link */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          {/* Profile Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 shadow-sm">
              {profilePhoto || user?.photoUrl ? (
                <img 
                  src={profilePhoto || user?.photoUrl || ''} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-[#8B4513] to-[#D2691E] rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-sm">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bienvenue, <span className="text-[#AB3500]">{userName}</span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Votre parcours vers l'expertise au Burkina Faso est en cours d'immortalisation.
              </p>
            </div>
          </div>

          {/* Portfolio Link */}
          <div className="bg-[#F5F5F5] rounded-xl p-4 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Lien Public du Portfolio
            </p>
            <div className="flex items-center gap-2 mb-3">
              <input 
                type="text" 
                readOnly 
                value={`${window.location.origin}/verify?id=${user?.id || '...'}`}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700"
              />
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-lg transition ${copied ? 'bg-green-500' : 'bg-[#AB3500] hover:bg-[#8B2E00]'}`}
                title="Copier le lien"
              >
                {copied ? (
                  <span className="text-white text-xs font-bold">✓</span>
                ) : (
                  <Copy className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
            <button 
              onClick={handleDownloadQR}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <QrCode className="w-4 h-4" />
              Télécharger QR Code
            </button>
            {/* QR Code invisible pour le téléchargement */}
            <div className="hidden">
              <QRCodeCanvas 
                value={`${window.location.origin}/verify?id=${user?.id}`}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-[#AB3500] mb-2">
            {loading ? '...' : badges.length.toString().padStart(2, '0')}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            BADGES OBTENUS
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-blue-500 mb-2">
            {loading ? '...' : new Set(badges.map(b => b.name.split(' ')[0])).size.toString().padStart(2, '0')}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            DOMAINES COUVERTS
          </div>
        </div>
      </div>

      {/* All Badges Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Mes Certifications
        </h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-gray-200 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : badges.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun badge obtenu</h3>
            <p className="text-sm text-gray-500">
              Vous n'avez pas encore reçu de badges. Un formateur doit vous attribuer un badge.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const colors = ['border-l-pink-400', 'border-l-[#AB3500]', 'border-l-blue-400', 'border-l-green-400', 'border-l-purple-400']
              const bgColor = ['bg-blue-50', 'bg-orange-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50']
              const randomIndex = badge.name.length % colors.length
              
              return (
                <Link 
                  key={badge.id} 
                  href={`/dashboard/badges/${badge.id}`}
                  className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${colors[randomIndex]} hover:shadow-md transition cursor-pointer group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${bgColor[randomIndex]} rounded-lg flex items-center justify-center group-hover:scale-110 transition`}>
                      <Award className="w-6 h-6" style={{ color: '#AB3500' }} />
                    </div>
                    <div className={`w-4 h-4 rounded-full ${badge.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-[#AB3500] transition">{badge.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-md">
                      {Array.isArray(badge.skills) ? badge.skills[0] : (badge.skills?.split(',')[0] || 'COMPÉTENCE')}
                    </span>
                    {badge.niveau && (
                      <span className={`inline-block px-2 py-1 text-[10px] font-semibold rounded-md ${getNiveauBadge(badge.niveau).color}`}>
                        {getNiveauBadge(badge.niveau).label}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Délivré le {new Date(badge.issuedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  {badge.issuer && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      Par: {badge.issuer.fullName}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-[#AB3500] text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
                    Voir les détails
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Progression par Domaine */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Progression par Domaine</h3>
        {levelProgress.total > 0 ? (
          <div className="space-y-4">
            {/* Débutant */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">Débutant</span>
                <span className="text-gray-500">{levelProgress.debutant} badge{levelProgress.debutant > 1 ? 's' : ''}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500" 
                  style={{ width: `${levelProgress.total > 0 ? (levelProgress.debutant / levelProgress.total) * 100 : 0}%` }} 
                />
              </div>
            </div>
            
            {/* Intermédiaire */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">Intermédiaire</span>
                <span className="text-gray-500">{levelProgress.intermediaire} badge{levelProgress.intermediaire > 1 ? 's' : ''}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${levelProgress.total > 0 ? (levelProgress.intermediaire / levelProgress.total) * 100 : 0}%` }} 
                />
              </div>
            </div>
            
            {/* Expert */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">Expert</span>
                <span className="text-gray-500">{levelProgress.expert} badge{levelProgress.expert > 1 ? 's' : ''}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                  style={{ width: `${levelProgress.total > 0 ? (levelProgress.expert / levelProgress.total) * 100 : 0}%` }} 
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">Aucun badge reçu pour le moment.</p>
        )}
      </div>

      {/* Dernières Certifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Dernières Certifications Reçues
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
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
          <p className="text-sm text-gray-400 italic text-center py-8">
            Aucune certification reçue pour le moment.
          </p>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {badge.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Par: {badge.issuer?.fullName || 'Formateur'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNiveauBadge(badge.niveau).color}`}>
                    {getNiveauBadge(badge.niveau).label}
                  </span>
                  <p className="text-sm text-gray-500 flex-shrink-0">
                    {new Date(badge.issuedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
