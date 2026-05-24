'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, Award, QrCode, Camera, Link2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Html5QrcodeScanner } from 'html5-qrcode'
import PortfolioContent from '@/components/portfolio-content'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const userIdFromUrl = searchParams.get('id')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [scanner, setScanner] = useState<any>(null)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [portfolioBadges, setPortfolioBadges] = useState<any[]>([])

  // Charger automatiquement si un ID est dans l'URL
  useEffect(() => {
    if (userIdFromUrl) {
      console.log('🔍 Chargement automatique du portfolio pour ID:', userIdFromUrl)
      handleViewPortfolio(userIdFromUrl)
    }
  }, [userIdFromUrl])

  // Fonction pour scanner le QR code
  const startQRScanner = () => {
    setShowQRScanner(true)
    setShowLinkInput(false)
    
    setTimeout(() => {
      const qrScanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      )
      
      qrScanner.render(
        (decodedText) => {
          qrScanner.clear()
          setShowQRScanner(false)
          extractUserIdFromLink(decodedText)
        },
        (error) => {
          console.warn('QR Scan error:', error)
        }
      )
      
      setScanner(qrScanner)
    }, 100)
  }

  // Fonction pour extraire l'ID utilisateur du lien
  const extractUserIdFromLink = (link: string) => {
    try {
      console.log('🔗 Lien reçu:', link)
      
      let userId = null
      
      try {
        const url = new URL(link)
        userId = url.searchParams.get('id')
      } catch (e) {
        const match = link.match(/[?&]id=([^&]+)/)
        if (match) {
          userId = match[1]
        }
      }
      
      console.log('🆔 ID extrait:', userId)
      
      if (userId) {
        handleViewPortfolio(userId)
      } else {
        alert('Lien invalide. Format attendu: /verify?id=USER_ID')
      }
    } catch (error) {
      console.error('Erreur parsing URL:', error)
      alert('Lien invalide. Assurez-vous que le lien contient ?id=USER_ID')
    }
  }

  // Fonction pour traiter le lien collé
  const handleLinkSubmit = () => {
    if (!linkInput.trim()) {
      alert('Veuillez entrer un lien')
      return
    }
    extractUserIdFromLink(linkInput)
    setLinkInput('')
    setShowLinkInput(false)
  }

  const handleViewPortfolio = async (userId: string) => {
    console.log('📥 Tentative de chargement pour ID:', userId)
    setIsLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const url = `${API_URL}/badges/portfolio/${userId}`
      console.log('📡 Appel API:', url)
      
      const response = await fetch(url)
      
      console.log('📊 Status de la réponse:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(' Erreur API:', errorText)
        throw new Error(`Portfolio non trouvé (Status: ${response.status})`)
      }
      
      const data = await response.json()
      console.log('✅ Portfolio chargé:', data)
      
      // Stocker les données pour le composant PortfolioContent
      setPortfolioData(data)
      setPortfolioBadges(data.badges || [])
    } catch (error: any) {
      console.error('❌ Erreur complète:', error)
      alert(`Erreur: ${error.message || 'Impossible de charger le portfolio'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Cliquant pour retour à l'accueil */}
            <Link href="/" className="flex items-center gap-2">
              <div className="text-xl font-bold">
                <span className="text-gray-900">Skill</span>
                <span className="text-orange-600">Badge</span>
              </div>
            </Link>
            
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Accueil</Link>
              <Link href="/verify" className="text-sm font-semibold text-orange-600 border-b-2 border-orange-600 pb-1">Vérification</Link>
            </div>
            
            {/* Bouton Retour - Toujours visible */}
            <div className="flex items-center gap-2">
              {portfolioData ? (
                <button
                  onClick={() => {
                    setPortfolioData(null)
                    setPortfolioBadges([])
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Retour</span>
                </button>
              ) : (
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Accueil</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du portfolio...</p>
            </div>
          </div>
        )}

        {/* Portfolio Display */}
        {!isLoading && portfolioData && (
          <PortfolioContent 
            userData={portfolioData}
            badges={portfolioBadges}
            loading={false}
          />
        )}

        {/* No Portfolio Selected - Show Search */}
        {!isLoading && !portfolioData && (
          <div>
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Vérifier un talent
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Accédez instantanément au registre officiel des compétences certifiées au Burkina Faso
              </p>
            </div>

            {/* Search Options */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                {/* Two buttons: QR Scanner and Link Input */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={startQRScanner}
                    className="flex flex-col items-center justify-center p-6 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 transition"
                  >
                    <Camera className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-sm font-semibold text-orange-900">Scanner QR Code</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowLinkInput(true)
                      setShowQRScanner(false)
                    }}
                    className="flex flex-col items-center justify-center p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition"
                  >
                    <Link2 className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-sm font-semibold text-blue-900">Coller le lien</span>
                  </button>
                </div>

                {/* QR Scanner */}
                {showQRScanner && (
                  <div className="mt-4">
                    <div id="qr-reader" className="w-full"></div>
                    <button
                      onClick={() => {
                        setShowQRScanner(false)
                        if (scanner) {
                          scanner.clear()
                        }
                      }}
                      className="mt-2 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                    >
                      Annuler
                    </button>
                  </div>
                )}

                {/* Link Input */}
                {showLinkInput && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLinkSubmit()}
                      placeholder="Collez le lien du portfolio (ex: skillbadge.bf/verify?id=...)"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleLinkSubmit}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition"
                      >
                        Vérifier
                      </button>
                      <button
                        onClick={() => {
                          setShowLinkInput(false)
                          setLinkInput('')
                        }}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                  <Shield className="w-3 h-3" />
                  <span>Accès public sécurisé — Aucune connexion requise</span>
                </div>
              </div>
            </div>

            {/* CTA for Recruiters */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-center text-white">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-3">Accès recruteur professionnel</h3>
                <p className="text-blue-100 mb-6">
                  Créez un compte pour accéder au catalogue complet des talents certifiés avec filtres avancés
                </p>
                <Link
                  href="/auth/register-recruteur"
                  className="inline-block px-8 py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition"
                >
                  S'inscrire comme recruteur
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
