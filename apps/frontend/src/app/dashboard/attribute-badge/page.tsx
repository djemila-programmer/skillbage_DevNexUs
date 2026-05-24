'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Award, AlertTriangle, Upload, X, Sparkles, ChevronDown, Check } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface BadgeTemplate {
  id: string
  name: string
  description: string
  createdAt: string
  domaine: string
}

export default function AttributeBadgePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  
  const [badges, setBadges] = useState<BadgeTemplate[]>([])
  const [selectedBadge, setSelectedBadge] = useState<BadgeTemplate | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('intermediaire')
  const [recommendationNote, setRecommendationNote] = useState('')
  const [emails, setEmails] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const myBadges = data.filter((b: any) => 
          b.issuerId === user?.id || b.issuer?.id === user?.id
        )
        setBadges(myBadges)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    }
  }

  const handleIssueBadge = async () => {
    if (!selectedBadge || !emails.trim()) {
      alert('Veuillez sélectionner un badge et entrer au moins un email')
      return
    }

    setLoading(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const emailList = emails
        .split(/[\n,]+/)
        .map(e => e.trim())
        .filter(e => e.length > 0 && e.includes('@'))

      if (emailList.length === 0) {
        alert('Veuillez entrer au moins un email valide')
        setLoading(false)
        return
      }

      let successCount = 0

      for (const email of emailList) {
        try {
          const usersResponse = await fetch(`${API_URL}/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (!usersResponse.ok) continue

          const users = await usersResponse.json()
          const recipient = users.find((u: any) => u.email === email && u.role === 'talent')

          if (!recipient) continue

          const badgeResponse = await fetch(`${API_URL}/badges`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              name: selectedBadge.name,
              description: selectedBadge.description,
              niveau: selectedLevel,
              note: recommendationNote,
              recipientId: recipient.id,
              issuerId: user?.id
            })
          })

          if (badgeResponse.ok) {
            successCount++
          }
        } catch (err) {
          console.error(`Error issuing badge to ${email}:`, err)
        }
      }

      if (successCount > 0) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2500)
      } else {
        alert('Erreur: Aucun badge n\'a pu être émis. Vérifiez les emails.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error issuing badge:', error)
      alert('Erreur lors de l\'émission du badge')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certification réussie !</h2>
          <p className="text-gray-600">Le badge a été émis avec succès sur la blockchain.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Émission</h1>
        <p className="text-sm text-gray-600">
          Sélectionnez le badge à émettre depuis votre bibliothèque.
        </p>
      </div>

      {/* Badge Selection Dropdown */}
      <div className="mb-6">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-6 py-4 bg-gray-200 rounded-xl text-left text-gray-700 font-medium flex items-center justify-between hover:bg-gray-300 transition"
          >
            <span className="text-sm">
              {selectedBadge ? selectedBadge.name : 'Choisir un badge dans votre collection...'}
            </span>
            <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {badges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => {
                    setSelectedBadge(badge)
                    setShowDropdown(false)
                  }}
                  className="w-full px-6 py-3 text-left hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 text-sm">{badge.name}</span>
                  {selectedBadge?.id === badge.id && (
                    <Check className="w-5 h-5 text-orange-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Badge Card */}
      {selectedBadge && (
        <>
          <div className="mb-8 p-6 bg-white border-2 border-[#8B4513] rounded-xl relative shadow-sm">
            <div className="absolute top-4 right-4 px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold rounded">
              SÉLECTIONNÉ
            </div>
            
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-[#8B4513]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedBadge.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedBadge.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  CRÉÉ LE {new Date(selectedBadge.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Level Selection */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
              Niveau d'expertise
            </label>
            <div className="flex gap-3">
              {['debutant', 'intermediaire', 'expert'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`flex-1 py-3 rounded-lg font-semibold text-xs transition ${
                    selectedLevel === level
                      ? 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {level === 'debutant' ? 'DÉBUTANT' : level === 'intermediaire' ? 'INTERMÉDIAIRE' : 'EXPERT'}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendation Note */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Note de recommandation
            </label>
            <textarea
              value={recommendationNote}
              onChange={(e) => setRecommendationNote(e.target.value)}
              placeholder="Excellent travail sur le projet final. Une maîtrise exceptionnelle des transitions complexes et de la hiérarchie visuelle."
              rows={3}
              className="w-full px-4 py-3 bg-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B4513] resize-none"
            />
          </div>

          {/* Import Students */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Importer les étudiants</h3>
            <p className="text-sm text-gray-600 mb-6">
              Ajoutez les bénéficiaires de cette certification.
            </p>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:bg-gray-50 transition cursor-pointer">
              <Upload className="w-8 h-8 text-[#8B4513] mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Téléverser un fichier CSV ou .XLSX
              </p>
              <p className="text-xs text-gray-500">
                Format requis: email, nom, prénom
              </p>
            </div>

            {/* Or paste emails */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-gray-50 text-gray-500 font-semibold uppercase">
                  Ou coller les emails
                </span>
              </div>
            </div>

            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="exemple1@savanna.com&#10;exemple2@savanna.com"
              rows={4}
              className="w-full px-4 py-3 bg-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#8B4513] resize-none"
            />
          </div>

          {/* Blockchain Warning */}
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-orange-800 mb-1">
                AVERTISSEMENT BLOCKCHAIN
              </h4>
              <p className="text-xs text-gray-700">
                L'émission est irréversible. Les empreintes cryptographiques seront scellées de manière permanente sur le registre Sahel. Assurez-vous de l'exactitude des données.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Annuler
            </button>
            <button
              onClick={handleIssueBadge}
              disabled={loading || !emails.trim()}
              className="flex-1 px-8 py-3 bg-[#8B4513] text-white rounded-xl font-semibold hover:bg-[#6B3410] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Émission en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Lancer la certification
                </>
              )}
            </button>
          </div>
        </>
      )}

    </div>
  )
}
