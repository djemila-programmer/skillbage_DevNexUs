'use client'

import { useState, useEffect } from 'react'
import { Camera, Mail, User, Globe, Moon, Send, CheckCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function SettingsTalent() {
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    objective: '',
    githubUrl: '',
    linkedin: '',
    customPortfolioUrl: '',
    portfolioIsPublic: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        objective: user.objective || '',
        githubUrl: user.githubUrl || '',
        linkedin: user.linkedin || '',
        customPortfolioUrl: user.customPortfolioUrl || '',
        portfolioIsPublic: user.portfolioIsPublic ?? true
      })
      // Charger la photo depuis localStorage ou user
      const savedPhoto = localStorage.getItem('userPhotoUrl')
      if (savedPhoto) {
        setProfileImage(savedPhoto)
      } else if (user.photoUrl) {
        setProfileImage(user.photoUrl)
      }
      
      // Charger le mode sombre
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode === 'true') {
        setDarkMode(true)
        document.documentElement.classList.add('dark')
      }
    }
  }, [user])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        setShowImageUpload(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const calculateCompletion = () => {
    let score = 0
    if (user?.fullName) score += 20
    if (formData.objective) score += 20
    if (formData.githubUrl) score += 20
    if (formData.linkedin) score += 20
    if (user?.photoUrl) score += 20
    return score
  }
  const completionScore = calculateCompletion()

  const handleSave = async () => {
    // Validation des URLs
    if (formData.githubUrl && !formData.githubUrl.match(/^https:\/\//)) {
      alert('Veuillez renseigner un vrai lien GitHub (commence par https://)')
      return
    }
    if (formData.linkedin && !formData.linkedin.match(/^https:\/\//)) {
      alert('Veuillez renseigner un vrai lien LinkedIn (commence par https://)')
      return
    }
    if (formData.customPortfolioUrl && !formData.customPortfolioUrl.match(/^https:\/\//)) {
      alert('Veuillez renseigner un vrai lien de portfolio (commence par https://)')
      return
    }
    
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      
      // Sauvegarder la photo dans localStorage
      if (profileImage) {
        localStorage.setItem('userPhotoUrl', profileImage)
      }
      
      // Sauvegarder dans la base de données via l'API
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          objective: formData.objective,
          githubUrl: formData.githubUrl,
          linkedin: formData.linkedin,
          customPortfolioUrl: formData.customPortfolioUrl,
          portfolioIsPublic: formData.portfolioIsPublic,
          photoUrl: profileImage || user?.photoUrl
        })
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      console.log('✅ Données sauvegardées dans la base de données')
      
      // Sauvegarder les données dans localStorage (pour le cache local)
      const userData = {
        ...user,
        id: user?.id || '',
        email: user?.email || '',
        role: user?.role || 'talent',
        objective: formData.objective,
        githubUrl: formData.githubUrl,
        linkedin: formData.linkedin,
        customPortfolioUrl: formData.customPortfolioUrl,
        portfolioIsPublic: formData.portfolioIsPublic,
        photoUrl: profileImage || user?.photoUrl
      }
      localStorage.setItem('userProfileData', JSON.stringify(userData))
      
      // Mettre à jour le store directement
      const { useAuthStore } = await import('@/store/auth')
      const setUser = useAuthStore.getState().setUser
      setUser(userData)
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      console.error('Erreur sauvegarde:', e)
      alert('Erreur lors de la sauvegarde. Réessayez.')
    }
    setIsSaving(false)
  }

  const publicUrl = formData.portfolioIsPublic
    ? (formData.customPortfolioUrl 
        ? `${window.location.origin}/p/${formData.customPortfolioUrl}` 
        : `${window.location.origin}/verify?id=${user?.id}`)
    : 'Portfolio vue désactivée'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                {profileImage ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-[#8B4513] to-[#D2691E] rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-white shadow-sm">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <button 
                  onClick={() => setShowImageUpload(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#AB3500] rounded-full flex items-center justify-center border-2 border-white hover:bg-orange-900 transition"
                  title="Modifier la photo"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.fullName || 'Utilisateur'}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                ADRESSE EMAIL (LECTURE SEULE)
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm outline-none pl-10"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* Nom complet (lecture seule) */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                NOM COMPLET
              </label>
              <input 
                type="text" 
                value={user?.fullName || ''}
                readOnly
                className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm outline-none"
              />
            </div>

            {/* Biography */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                BIOGRAPHIE PROFESSIONNELLE
              </label>
              <textarea 
                value={formData.objective}
                onChange={(e) => setFormData({...formData, objective: e.target.value})}
                placeholder="Décrivez votre objectif ou biographie professionnelle..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-[#AB3500] rounded-lg text-sm outline-none resize-none min-h-[100px] transition-colors"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  LIEN GITHUB
                </label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                    placeholder="https://github.com/votre-profil"
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm outline-none placeholder-gray-500 pl-10 focus:ring-2 focus:ring-[#AB3500]"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.646.982.782-.217 1.618-.327 2.452-.331.834.004 1.67.114 2.452.331 1.638-1.304 2.646-.982 2.646-.982.652 1.652.241 2.873.117 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">
                  LIEN LINKEDIN
                </label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    placeholder="https://linkedin.com/in/votre-profil"
                    className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm outline-none placeholder-gray-500 pl-10 focus:ring-2 focus:ring-[#AB3500]"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Visibility & URL */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Visibilité & URL</h3>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Rendre mon portfolio public</h4>
                  <p className="text-xs text-gray-600">Autoriser les recruteurs à voir vos badges et votre progression.</p>
                </div>
                <button 
                  onClick={() => setFormData({ ...formData, portfolioIsPublic: !formData.portfolioIsPublic })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${formData.portfolioIsPublic ? 'bg-emerald-800' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.portfolioIsPublic ? 'left-[26px]' : 'left-0.5'}`} />
                </button>
              </div>
              
              {/* URL du portfolio */}
              <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${formData.portfolioIsPublic ? 'text-gray-700' : 'text-red-600'}`}>
                    {publicUrl}
                  </span>
                  {formData.portfolioIsPublic && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(publicUrl)
                        setCopySuccess(true)
                        setTimeout(() => setCopySuccess(false), 2000)
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded transition"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-[#AB3500] text-white font-bold rounded-xl hover:bg-orange-900 transition disabled:opacity-50"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
              <button className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                Annuler
              </button>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              PRÉFÉRENCES D'AFFICHAGE
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#AB3500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">Langue</span>
                </div>
                <span className="text-sm font-bold text-[#AB3500]">Français (FR)</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-[#AB3500]" />
                  <span className="text-sm font-semibold text-gray-900">Mode Sombre</span>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#AB3500]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'left-[26px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Contact Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-[#AB3500] uppercase mb-4">
              VEUX-TU NOUS ENVOYER UN MESSAGE?
            </h3>
            <textarea 
              placeholder="Ecrivez ici"
              className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm outline-none resize-none min-h-[100px] mb-4 placeholder-gray-500"
            />
            <button className="w-full py-3 bg-[#AB3500] text-white font-bold rounded-xl hover:bg-orange-900 transition">
              Envoyer le message
            </button>
          </div>

          {/* Portfolio Status */}
          <div className="bg-gradient-to-br from-[#0c2a47] to-[#1a4b77] rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-blue-200">
              COMPLÉTION DU PORTFOLIO
            </h3>
            <div className="flex items-center justify-between mb-3">
              <div className="text-3xl font-bold">{completionScore}%</div>
              {completionScore === 100 && <CheckCircle className="w-6 h-6 text-emerald-400" />}
            </div>
            <div className="h-2 bg-blue-900 rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{width: `${completionScore}%`}} />
            </div>
            <p className="text-sm text-blue-100">
              {completionScore === 100 ? "Votre portfolio est complet !" : "Complétez vos liens pour atteindre 100% de visibilité."}
            </p>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Modifier la photo de profil</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowImageUpload(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
