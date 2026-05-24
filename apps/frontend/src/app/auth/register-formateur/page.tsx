'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, X, ChevronDown, ArrowRight, Upload, Link as LinkIcon, ArrowLeft } from 'lucide-react'

export default function RegisterFormateur() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    responsableName: '',
    organisation: '',
    email: '',
    password: '',
    confirmPassword: '',
    domain: '',
    domainOther: '',
    experience: '',
    skills: [] as string[],
    linkedin: '',
    file: null as File | null
  })
  const [newSkill, setNewSkill] = useState('')
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.responsableName.trim()) {
      newErrors.responsableName = 'Le nom est requis'
    }

    if (!formData.organisation.trim()) {
      newErrors.organisation = 'L\'organisation est requise'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Doit contenir: majuscule, minuscule, chiffre et caractère spécial'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    if (!formData.domain) {
      newErrors.domain = 'Le domaine est requis'
    }

    if (formData.domain === 'autre' && !formData.domainOther.trim()) {
      newErrors.domainOther = 'Veuillez préciser le domaine'
    }

    if (!formData.experience) {
      newErrors.experience = 'L\'expérience est requise'
    }

    // Vérifier qu'au moins une compétence est ajoutée
    if (formData.skills.length === 0) {
      newErrors.skills = 'Ajoutez au moins une compétence'
    }

    // Vérifier qu'un fichier est téléversé
    if (!formData.file) {
      newErrors.file = 'Le fichier justificatif est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({...formData, skills: [...formData.skills, newSkill.trim()]})
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      // API call to register user
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'formateur',
          fullName: formData.responsableName,
          walletAddress: '', // Optional, can be added later
          organisation: formData.organisation
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Échec de l\'inscription')
      }

      const data = await response.json()
      console.log('Registration successful:', data)
      
      // Afficher le message de succès
      setSuccess(true)
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Échec de l\'inscription. Veuillez réessayer.' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Bouton Retour */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" style={{ color: '#A04000' }} />
            <span className="text-xl font-bold" style={{ color: '#A04000' }}>SkillBadge</span>
          </div>
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message de succès */}
        {success ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Demande envoyée !</h2>
            <p className="text-gray-600 mb-2">
              Votre requête sera traitée sous <span className="font-bold text-[#A04000]">48h</span> par l'équipe SkillBadge.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Vous recevrez un email de confirmation une fois votre compte activé.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 rounded-xl font-semibold transition"
              style={{ backgroundColor: '#A04000', color: 'white' }}
            >
              Retour à l'accueil
            </button>
          </div>
        ) : (
        <>

        {/* Tabs */}
        <div className="p-1 rounded-xl inline-flex mb-6 w-full" style={{ backgroundColor: '#F5F5F5' }}>
          <button 
            onClick={() => router.push('/auth/login-formateur')}
            className="flex-1 px-4 py-3 rounded-lg text-sm font-normal"
            style={{ color: '#78716C' }}
          >
            Se connecter
          </button>
          <button className="flex-1 px-4 py-3 rounded-lg text-sm font-normal" style={{ backgroundColor: '#FFFFFF', color: '#A04000', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            S'inscrire
          </button>
        </div>

        {/* Role Toggle */}
        <div className="p-1 rounded-xl inline-flex mb-8 w-full" style={{ backgroundColor: '#F5F5F5' }}>
          <button 
            onClick={() => router.push('/auth/register-talent')}
            className="flex-1 px-4 py-5 rounded-xl text-sm font-normal"
            style={{ color: '#78716C' }}
          >
            Talent<br/>numériques
          </button>
          <button className="flex-1 px-4 py-5 rounded-xl text-sm font-bold" style={{ backgroundColor: '#A04000', color: '#FFFFFF' }}>
            Structure de<br/>formation
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nom du responsable */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              NOM DU RESPONSABLE *
            </label>
            <input 
              type="text"
              value={formData.responsableName}
              onChange={(e) => {
                setFormData({...formData, responsableName: e.target.value})
                if (errors.responsableName) setErrors({...errors, responsableName: ''})
              }}
              placeholder="Votre nom complet"
              className={`w-full h-14 rounded-xl px-6 text-base outline-none transition placeholder:text-gray-900 ${errors.responsableName ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
            />
            {errors.responsableName && <p className="text-xs text-red-500 mt-1">{errors.responsableName}</p>}
          </div>

          {/* Organisation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              ORGANISATION *
            </label>
            <input 
              type="text"
              value={formData.organisation}
              onChange={(e) => {
                setFormData({...formData, organisation: e.target.value})
                if (errors.organisation) setErrors({...errors, organisation: ''})
              }}
              placeholder="Académie Numérique Burkina"
              className={`w-full h-14 rounded-xl px-6 text-base outline-none transition placeholder:text-gray-900 ${errors.organisation ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
            />
            {errors.organisation && <p className="text-xs text-red-500 mt-1">{errors.organisation}</p>}
          </div>

          {/* Email professionnel */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              EMAIL PROFESSIONNEL *
            </label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value})
                if (errors.email) setErrors({...errors, email: ''})
              }}
              placeholder="contact@academie.bf"
              className={`w-full h-14 rounded-xl px-6 text-base outline-none transition placeholder:text-gray-900 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              MOT DE PASSE *
            </label>
            <input 
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value})
                if (errors.password) setErrors({...errors, password: ''})
              }}
              placeholder="••••••••••••"
              className={`w-full h-14 rounded-xl px-6 text-base outline-none transition placeholder:text-gray-900 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#57534E' }}>
              Confirmer mot de passe *
            </label>
            <input 
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({...formData, confirmPassword: e.target.value})
                if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''})
              }}
              placeholder="••••••••"
              className={`w-full h-14 rounded-xl px-6 text-base outline-none transition placeholder:text-gray-900 ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Domaine principal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              DOMAINE PRINCIPAL *
            </label>
            <div className="relative">
              <select 
                value={formData.domain}
                onChange={(e) => {
                  setFormData({...formData, domain: e.target.value})
                  if (errors.domain) setErrors({...errors, domain: ''})
                }}
                className={`w-full h-14 rounded-xl px-6 text-base outline-none transition appearance-none cursor-pointer ${errors.domain ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: '#E7E5E4', color: formData.domain ? '#1C1917' : '#A8A29E' }}
              >
                <option value="" disabled style={{ color: '#A8A29E' }}>Choisir un domaine</option>
                <option value="dev-logiciel" style={{ color: '#1C1917' }}>Développement Logiciel</option>
                <option value="infrastructure" style={{ color: '#1C1917' }}>Infrastructure & DevOps</option>
                <option value="cybersecurite" style={{ color: '#1C1917' }}>Cybersécurité</option>
                <option value="data-ia" style={{ color: '#1C1917' }}>Data & IA</option>
                <option value="design" style={{ color: '#1C1917' }}>Design UX/UI</option>
                <option value="blockchain" style={{ color: '#1C1917' }}>Blockchain & Web3</option>
                <option value="entrepreneuriat" style={{ color: '#1C1917' }}>Entrepreneuriat Digital</option>
                <option value="marketing" style={{ color: '#1C1917' }}>Marketing Digital</option>
                <option value="autre" style={{ color: '#1C1917' }}>Autre (à préciser)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#78716C' }} />
            </div>
            {errors.domain && <p className="text-xs text-red-500 mt-1">{errors.domain}</p>}
            {formData.domain === 'autre' && (
              <input 
                type="text"
                value={formData.domainOther}
                onChange={(e) => {
                  setFormData({...formData, domainOther: e.target.value})
                  if (errors.domainOther) setErrors({...errors, domainOther: ''})
                }}
                placeholder="Précisez votre domaine"
                className={`w-full h-14 rounded-xl px-6 text-base outline-none transition placeholder:text-gray-900 mt-3 ${errors.domainOther ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
              />
            )}
            {errors.domainOther && <p className="text-xs text-red-500 mt-1">{errors.domainOther}</p>}
          </div>

          {/* Expérience */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              EXPÉRIENCE *
            </label>
            <div className="relative">
              <select 
                value={formData.experience}
                onChange={(e) => {
                  setFormData({...formData, experience: e.target.value})
                  if (errors.experience) setErrors({...errors, experience: ''})
                }}
                className={`w-full h-14 rounded-xl px-6 text-base outline-none transition appearance-none cursor-pointer ${errors.experience ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: '#E7E5E4', color: formData.experience ? '#1C1917' : '#A8A29E' }}
              >
                <option value="" disabled style={{ color: '#A8A29E' }}>Choisir votre expérience</option>
                <option value="1-2" style={{ color: '#1C1917' }}>1-2 ans</option>
                <option value="3-5" style={{ color: '#1C1917' }}>3-5 ans</option>
                <option value="5-10" style={{ color: '#1C1917' }}>5-10 ans</option>
                <option value="10+" style={{ color: '#1C1917' }}>Plus de 10 ans</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#78716C' }} />
            </div>
            {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
          </div>

          {/* Compétences enseignées */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              COMPÉTENCES ENSEIGNÉES *
            </label>
            <div className="rounded-xl p-4" style={{ backgroundColor: '#E7E5E4' }}>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: 'rgba(160, 64, 0, 0.1)', color: '#A04000' }}
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:opacity-70">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Ex: React.js, Python, Figma..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-900"
                  style={{ color: '#57534E' }}
                />
                <button 
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-1 rounded-lg text-sm font-bold transition hover:opacity-80"
                  style={{ backgroundColor: '#A04000', color: 'white' }}
                >
                  + Ajouter
                </button>
              </div>
            </div>
            {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
          </div>

          {/* Profil LinkedIn */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              PROFIL LINKEDIN (OPTIONNEL)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A8A29E' }} />
              <input 
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                placeholder="linkedin.com/in/..."
                className="w-full h-14 rounded-xl pl-12 pr-6 text-base outline-none transition placeholder:text-gray-900"
                style={{ backgroundColor: '#E7E5E4', color: '#57534E' }}
              />
            </div>
          </div>

          {/* Upload File */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#78716C' }}>
              PIÈCE JUSTIFICATIVE *
            </label>
            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:opacity-80 transition ${errors.file ? 'border-red-500' : ''}`} style={{ borderColor: errors.file ? '#EF4444' : 'rgba(160, 64, 0, 0.3)' }}>
              <input 
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setFormData({...formData, file})
                  if (errors.file) setErrors({...errors, file: ''})
                }}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#A04000' }} />
                <div className="text-sm font-semibold" style={{ color: '#57534E' }}>
                  {formData.file ? formData.file.name : 'Téléverser un fichier'}
                </div>
                <div className="text-xs mt-1" style={{ color: '#A8A29E' }}>PDF, JPG ou PNG (max 5MB)</div>
              </label>
            </div>
            {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full h-14 rounded-xl text-white text-base font-bold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 mt-8"
            style={{ backgroundColor: '#A04000' }}
          >
            Créer mon compte formateur
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Info Text */}
        <div className="mt-4 text-center text-xs leading-relaxed" style={{ color: '#78716C' }}>
          Votre demande va etre examiner par l'equipe SkillBadge sous 48 heures. un message vous sera envoyé par mail.
        </div>

        {/* Legal Text */}
        <div className="mt-4 text-center text-xs leading-relaxed" style={{ color: '#78716C' }}>
          En vous inscrivant, vous acceptez nos{' '}
          <span className="font-semibold" style={{ color: '#A04000' }}>Conditions d'Utilisation</span>
          {' '}et <span className="font-semibold" style={{ color: '#A04000' }}>notre Politique de Confidentialité</span>.
        </div>

        </>
      )}

      </div>
    </div>
  )
}
