'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Award, Check, MapPin, Mail, 
  Download, ExternalLink, Shield, Calendar, User
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

export default function PublicPortfolioPage() {
  const params = useParams()
  const username = params.username as string
  
  const [talent, setTalent] = useState<any>(null)
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    loadPortfolio()
  }, [username])

  const loadPortfolio = async () => {
    try {
      // Chercher l'utilisateur par customPortfolioUrl ou skillBadgeId
      const response = await fetch('http://localhost:3001/api/users')
      const users = await response.json()
      
      const foundUser = users.find((u: any) => 
        u.customPortfolioUrl === username || 
        u.skillBadgeId === username ||
        u.id === username
      )
      
      if (foundUser) {
        setTalent(foundUser)
        
        // Charger ses badges
        const badgesResponse = await fetch(`http://localhost:3001/api/badges/user/${foundUser.id}`)
        const badgesData = await badgesResponse.json()
        setBadges(badgesData)
      }
    } catch (error) {
      console.error('Error loading portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBadgeClick = (badge: any) => {
    setSelectedBadge(badge)
    setShowBadgeModal(true)
  }

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `portfolio-${username}-qr.png`
      link.href = url
      link.click()
    }
  }

  // Calculer les statistiques
  const uniqueDomains = new Set(badges.map(b => b.domain || b.name?.split(' ')[0])).size
  const uniqueIssuers = new Set(badges.map(b => b.issuer?.fullName || b.issuer)).size

  // Barres de progression par domaine
  const domainProgress = badges.reduce((acc: any, badge: any) => {
    const domain = badge.domain || badge.name?.split(' ')[0] || 'Général'
    if (!acc[domain]) {
      acc[domain] = { count: 0, levels: [] }
    }
    acc[domain].count++
    acc[domain].levels.push(badge.niveau?.toLowerCase())
    return acc
  }, {})

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio non trouvé</h2>
          <p className="text-gray-600 mb-6">Ce portfolio n'existe pas ou n'est pas public</p>
          <Link href="/" className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            <span className="text-gray-900">Skill</span>
            <span className="text-orange-600">Badge</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden shrink-0">
              <img 
                src={talent.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"} 
                alt={talent.fullName} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{talent.fullName}</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" /> Vérifié
                </span>
              </div>
              
              {talent.bio && (
                <p className="text-gray-600 mb-4">{talent.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                {talent.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{talent.city}</span>
                  </div>
                )}
                {talent.githubUrl && (
                  <a href={talent.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                )}
                {talent.linkedin && (
                  <a href={talent.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a 
                  href={`mailto:${talent.email}`}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contacter
                </a>
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  QR Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{badges.length}</div>
            <div className="text-sm text-gray-600 font-semibold">Certifications</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{uniqueDomains}</div>
            <div className="text-sm text-gray-600 font-semibold">Domaines</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{uniqueIssuers}</div>
            <div className="text-sm text-gray-600 font-semibold">Formateurs</div>
          </div>
        </div>

        {/* Domain Progress */}
        {Object.keys(domainProgress).length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progression par domaine</h2>
            <div className="space-y-6">
              {Object.entries(domainProgress).map(([domain, data]: [string, any]) => {
                const maxLevel = data.levels.includes('expert') ? 100 : 
                                data.levels.includes('avance') ? 75 : 
                                data.levels.includes('intermediaire') ? 50 : 25
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">{domain}</span>
                      <span className="text-gray-500">{maxLevel}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${maxLevel}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Badges Grid */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges certifiés</h2>
          
          {badges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun badge obtenu pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  onClick={() => handleBadgeClick(badge)}
                  className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase">
                        {badge.niveau || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {badge.issuer && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4" />
                      <span>{badge.issuer.fullName || badge.issuer}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(badge.issuedAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-xs text-green-600 font-medium">
                    <Shield className="w-3 h-3" />
                    Vérifié blockchain
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Badge Detail Modal */}
      {showBadgeModal && selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedBadge.name}</h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold uppercase">
                    Niveau {selectedBadge.niveau}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowBadgeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {selectedBadge.description && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Description</h4>
                <p className="text-gray-700">{selectedBadge.description}</p>
              </div>
            )}

            {selectedBadge.criteres && selectedBadge.criteres.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Critères validés</h4>
                <div className="space-y-2">
                  {selectedBadge.criteres.map((critere: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span>{critere}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedBadge.note && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-bold text-blue-900 mb-2">Note du formateur</h4>
                <p className="text-blue-800 italic">"{selectedBadge.note}"</p>
              </div>
            )}

            {selectedBadge.blockchainHash && (
              <a 
                href={`https://polygonscan.com/tx/${selectedBadge.blockchainHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Voir la preuve sur Polygon
              </a>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">QR Code du Portfolio</h3>
              <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                ✕
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 flex flex-col items-center">
              <QRCodeCanvas 
                value={window.location.href}
                size={256}
                level="H"
                includeMargin={true}
              />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Scannez pour voir le portfolio de {talent.fullName}
              </p>
            </div>

            <button 
              onClick={handleDownloadQR}
              className="w-full mt-6 px-4 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition"
            >
              Télécharger QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
