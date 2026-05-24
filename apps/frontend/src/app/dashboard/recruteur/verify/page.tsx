'use client'

import { useState, useEffect } from 'react'
import { Search, Shield, Award, QrCode, Camera, Link2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Html5QrcodeScanner } from 'html5-qrcode'
import PortfolioContent from '@/components/portfolio-content'

export default function RecruiterVerifyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkInput, setLinkInput] = useState('')
  const [scanner, setScanner] = useState<any>(null)
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [portfolioBadges, setPortfolioBadges] = useState<any[]>([])

  // Fonction pour scanner le QR code
  const startQRScanner = () => {
    setShowQRScanner(true)
    setShowLinkInput(false)
    
    setTimeout(() => {
      const qrScanner = new Html5QrcodeScanner(
        'qr-reader-recruiter',
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
          handleViewPortfolio(decodedText)
        },
        (errorMessage) => {
          // Erreur de lecture QR
        }
      )
      
      setScanner(qrScanner)
    }, 100)
  }

  const stopQRScanner = () => {
    if (scanner) {
      scanner.clear()
      setScanner(null)
    }
    setShowQRScanner(false)
  }

  // Extraire l'ID du portfolio depuis l'URL
  const extractUserId = (url: string): string | null => {
    try {
      // Format: http://localhost:3002/portfolio/[id] ou https://skillbadge.bf/p/[id]
      const match = url.match(/\/(?:portfolio|p)\/([^\/\?]+)/)
      if (match) return match[1]
      
      // Si c'est juste un ID
      if (url.length > 5 && !url.includes('http')) return url
      
      return null
    } catch {
      return null
    }
  }

  // Charger un portfolio depuis un lien
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const userId = extractUserId(linkInput)
    if (userId) {
      handleViewPortfolio(userId)
    } else {
      alert('Lien invalide')
    }
  }

  // Charger les données du portfolio
  const handleViewPortfolio = async (userId: string) => {
    setIsLoading(true)
    setIsSearching(true)
    setPortfolioData(null)
    setPortfolioBadges([])
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      
      // Charger les infos de l'utilisateur
      const userResponse = await fetch(`${API_URL}/users/${userId}`)
      if (!userResponse.ok) throw new Error('Utilisateur non trouvé')
      const userData = await userResponse.json()
      
      // Charger les badges
      const badgesResponse = await fetch(`${API_URL}/badges/user/${userId}`)
      if (badgesResponse.ok) {
        const badgesData = await badgesResponse.json()
        setPortfolioBadges(badgesData)
      }
      
      setPortfolioData({
        id: userData.id || userId,
        fullName: userData.fullName || 'Utilisateur',
        email: userData.email,
        objective: userData.objective,
        city: userData.city,
        level: userData.level,
        domain: userData.domain,
        modules: userData.modules,
        bio: userData.bio,
        githubUrl: userData.githubUrl,
        linkedin: userData.linkedin,
        customPortfolioUrl: userData.customPortfolioUrl,
        photoUrl: userData.photoUrl,
      })
      
    } catch (error) {
      console.error('Erreur chargement portfolio:', error)
      alert('Impossible de charger ce portfolio')
    } finally {
      setIsLoading(false)
    }
  }

  // Recherche par nom/email
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    setIsSearching(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/badges/search?q=${encodeURIComponent(searchQuery)}`)
      
      if (response.ok) {
        const results = await response.json()
        if (results.length > 0) {
          handleViewPortfolio(results[0].id)
        } else {
          alert('Aucun résultat trouvé')
        }
      }
    } catch (error) {
      console.error('Erreur recherche:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSearch = () => {
    setIsSearching(false)
    setPortfolioData(null)
    setPortfolioBadges([])
    setSearchQuery('')
    setLinkInput('')
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/recruteur"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vérification rapide
        </h1>
        <p className="text-gray-600">
          Vérifiez les certifications d'un candidat via son portfolio, QR code ou lien
        </p>
      </div>

      {/* Search Options */}
      {!isSearching && (
        <div className="space-y-6">
          {/* Search by Name/Email */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setShowLinkInput(!showLinkInput)
                setShowQRScanner(false)
              }}
              className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition group"
            >
              <Link2 className="w-8 h-8 text-gray-400 group-hover:text-orange-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Coller un lien</p>
                <p className="text-sm text-gray-500">Portfolio ou ID SkillBadge</p>
              </div>
            </button>

            <button
              onClick={() => {
                startQRScanner()
                setShowLinkInput(false)
              }}
              className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition group"
            >
              <QrCode className="w-8 h-8 text-gray-400 group-hover:text-orange-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Scanner un QR code</p>
                <p className="text-sm text-gray-500">Utiliser la caméra</p>
              </div>
            </button>
          </div>

          {/* Link Input */}
          {showLinkInput && (
            <form onSubmit={handleLinkSubmit} className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lien du portfolio ou ID SkillBadge
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="http://localhost:3002/portfolio/[id] ou SB-XXXXX"
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Vérifier
                </button>
              </div>
            </form>
          )}

          {/* QR Scanner */}
          {showQRScanner && (
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Scanner un QR code</h3>
                <button
                  onClick={stopQRScanner}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Fermer
                </button>
              </div>
              <div id="qr-reader-recruiter" className="max-w-sm mx-auto"></div>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du portfolio...</p>
        </div>
      )}

      {/* Portfolio Display */}
      {portfolioData && !isLoading && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Portfolio vérifié
            </h2>
            <button
              onClick={resetSearch}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Nouvelle recherche
            </button>
          </div>
          
          <PortfolioContent 
            userData={portfolioData}
            badges={portfolioBadges}
            loading={false}
          />
        </div>
      )}
    </div>
  )
}
