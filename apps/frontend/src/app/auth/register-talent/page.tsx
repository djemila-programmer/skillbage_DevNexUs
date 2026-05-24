'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, X, ChevronDown, ArrowRight, Calendar, ArrowLeft } from 'lucide-react'

export default function RegisterTalent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
    level: '',
    domain: '',
    modules: [] as string[],
    objective: ''
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom est requis'
    }

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = 'La date de naissance est requise'
    } else {
      // Vérifier que l'âge est supérieur à 15 ans
      const birthDate = new Date(formData.birthDate)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      
      if (adjustedAge < 15) {
        newErrors.birthDate = 'Vous devez avoir au moins 15 ans'
      }
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
      newErrors.password = 'Doit contenir: majuscule, minuscule, chiffre et caractère spécial (@$!%*?&)'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    if (!formData.level) {
      newErrors.level = 'Le niveau est requis'
    }

    if (!formData.domain) {
      newErrors.domain = 'Le domaine est requis'
    }

    if (!formData.objective) {
      newErrors.objective = 'L\'objectif est requis'
    }

    // Vérifier qu'au moins un module est sélectionné si un domaine est choisi
    if (formData.domain && formData.modules.length === 0) {
      newErrors.modules = 'Sélectionnez au moins un module'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Module mapping by domain - Complete reference: 8 categories, 48 badges
  const domainModules: Record<string, string[]> = {
    'dev-web-mobile': [
      // Beginner (3)
      'HTML / CSS Fondamentaux',
      'JavaScript ES6+',
      'WordPress & CMS',
      // Intermediate (4)
      'React.js',
      'Flutter / Dart',
      'Node.js & APIs REST',
      'React Native',
      // Expert (2)
      'Next.js / Nuxt.js',
      'Architecture Web Full-Stack'
    ],
    'design-uiux': [
      // Beginner (2)
      'Figma — Bases',
      'Principes UX & Wireframing',
      // Intermediate (2)
      'Prototypage Interactif',
      'Design System & Composants',
      // Expert (2)
      'Recherche Utilisateur',
      'Direction Artistique UI'
    ],
    'data-ia': [
      // Beginner (2)
      'Python pour la Data',
      'Excel / Google Sheets Avancé',
      // Intermediate (2)
      'SQL & Bases de Données',
      'Visualisation (Power BI / Tableau)',
      // Expert (3)
      'Machine Learning Fondamental',
      'NLP & Traitement du Texte',
      'Pipelines de Données'
    ],
    'cybersecurite': [
      // Beginner (1)
      'Bases des Réseaux & Protocoles',
      // Intermediate (2)
      'Sécurité des Applications Web',
      'Tests de Pénétration (bases)',
      // Expert (2)
      'Gestion des Incidents & SOC',
      'Cryptographie Appliquée'
    ],
    'infrastructure-devops': [
      // Beginner (1)
      'Linux & Administration Système',
      // Intermediate (3)
      'Docker & Conteneurisation',
      'CI/CD & Automatisation',
      'Cloud (AWS / GCP — Bases)',
      // Expert (2)
      'Kubernetes',
      'Architecture Cloud Scalable'
    ],
    'blockchain-web3': [
      // Beginner (1)
      'Principes de la Blockchain',
      // Intermediate (2)
      'Smart Contracts (Solidity — bases)',
      'NFT & Standards ERC',
      // Expert (2)
      'DeFi & Protocoles Web3',
      'Développement d\'App Complet'
    ],
    'gestion-projet': [
      // Beginner (2)
      'Agile / Scrum — Fondamentaux',
      'Outils de Gestion (Notion, Jira)',
      // Intermediate (1)
      'Gestion de Backlog & Sprints',
      // Expert (2)
      'Gestion d\'Équipe Tech',
      'Product Management'
    ],
    'marketing-digital': [
      // Beginner (1)
      'Réseaux Sociaux & Stratégie Contenu',
      // Intermediate (3)
      'SEO & Référencement',
      'Publicité Facebook / Google Ads',
      'Email Marketing & Automation',
      // Expert (1)
      'Analytics & Mesure des Résultats'
    ]
  }

  const handleDomainChange = (domain: string) => {
    setFormData({...formData, domain: domain, modules: []})
  }

  const handleModuleToggle = (module: string) => {
    const currentModules = formData.modules
    if (currentModules.includes(module)) {
      setFormData({...formData, modules: currentModules.filter(m => m !== module)})
    } else {
      setFormData({...formData, modules: [...currentModules, module]})
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
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
          role: 'talent',
          fullName: formData.fullName,
          walletAddress: '' // Optional, can be added later
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Échec de l\'inscription')
      }

      const data = await response.json()
      console.log('Registration successful:', data)
      
      // Success - redirect to login page
      router.push('/auth/login-talent?registered=true')
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Échec de l\'inscription. Veuillez réessayer.' })
    } finally {
      setLoading(false)
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

        {/* Tabs */}
        <div className="p-1 rounded-xl inline-flex mb-6 w-full" style={{ backgroundColor: '#F5F5F5' }}>
          <button 
            onClick={() => router.push('/auth/login-talent')}
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
          <button className="flex-1 px-4 py-5 rounded-xl text-sm font-bold" style={{ backgroundColor: '#A04000', color: '#FFFFFF' }}>
            Talent<br/>numériques
          </button>
          <button 
            onClick={() => router.push('/auth/register-formateur')}
            className="flex-1 px-4 py-5 rounded-xl text-sm font-normal"
            style={{ color: '#78716C' }}
          >
            Structure de<br/>formation
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nom et prénom */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Nom et prénom *
            </label>
            <input 
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({...formData, fullName: e.target.value})
                if (errors.fullName) setErrors({...errors, fullName: ''})
              }}
              placeholder="Votre nom complet"
              className={`w-full h-16 rounded-2xl px-5 text-base outline-none transition placeholder:text-gray-900 ${errors.fullName ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E5E5E5', color: '#57534E' }}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Date de naissance *
            </label>
            <div className="relative">
              <input 
                type="date"
                value={formData.birthDate}
                onChange={(e) => {
                  setFormData({...formData, birthDate: e.target.value})
                  if (errors.birthDate) setErrors({...errors, birthDate: ''})
                }}
                className={`w-full h-16 rounded-2xl px-5 pr-12 text-base outline-none transition ${errors.birthDate ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: '#E5E5E5', color: '#57534E' }}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#A8A29E' }} />
            </div>
            {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Email *
            </label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value})
                if (errors.email) setErrors({...errors, email: ''})
              }}
              placeholder="votre@email.com"
              className={`w-full h-16 rounded-2xl px-5 text-base outline-none transition placeholder:text-gray-900 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E5E5E5', color: '#57534E' }}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Mot de passe *
            </label>
            <input 
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value})
                if (errors.password) setErrors({...errors, password: ''})
              }}
              placeholder="••••••••"
              className={`w-full h-16 rounded-2xl px-5 text-base outline-none transition placeholder:text-gray-900 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E5E5E5', color: '#57534E' }}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirmer mot de passe */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
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
              className={`w-full h-16 rounded-2xl px-5 text-base outline-none transition placeholder:text-gray-900 ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
              style={{ backgroundColor: '#E5E5E5', color: '#57534E' }}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Niveau actuel */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Niveau actuel *
            </label>
            <div className="relative">
              <select 
                value={formData.level}
                onChange={(e) => {
                  setFormData({...formData, level: e.target.value})
                  if (errors.level) setErrors({...errors, level: ''})
                }}
                className={`w-full h-16 rounded-2xl px-5 text-base outline-none transition appearance-none cursor-pointer ${errors.level ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: '#E5E5E5', color: formData.level ? '#1C1917' : '#A8A29E' }}
              >
                <option value="" disabled style={{ color: '#A8A29E' }}>Choisir un niveau</option>
                <option value="debutant" style={{ color: '#1C1917' }}>Débutant</option>
                <option value="intermediaire" style={{ color: '#1C1917' }}>Intermédiaire</option>
                <option value="expert" style={{ color: '#1C1917' }}>Expert</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A8A29E' }} />
            </div>
            {errors.level && <p className="text-xs text-red-500 mt-1">{errors.level}</p>}
          </div>

          {/* Domaine d'intérêt */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Domaine d'intérêt *
            </label>
            <div className="relative">
              <select 
                value={formData.domain}
                onChange={(e) => {
                  handleDomainChange(e.target.value)
                  if (errors.domain) setErrors({...errors, domain: ''})
                }}
                className={`w-full h-16 rounded-2xl px-5 text-base outline-none transition appearance-none cursor-pointer ${errors.domain ? 'ring-2 ring-red-500' : ''}`}
                style={{ backgroundColor: '#E5E5E5', color: formData.domain ? '#1C1917' : '#A8A29E' }}
              >
                <option value="" disabled style={{ color: '#A8A29E' }}>Choisir un domaine</option>
                <option value="dev-web-mobile" style={{ color: '#1C1917' }}>Développement Web & Mobile</option>
                <option value="design-uiux" style={{ color: '#1C1917' }}>Design UI/UX</option>
                <option value="data-ia" style={{ color: '#1C1917' }}>Data & Intelligence Artificielle</option>
                <option value="cybersecurite" style={{ color: '#1C1917' }}>Cybersécurité</option>
                <option value="infrastructure-devops" style={{ color: '#1C1917' }}>Infrastructure & DevOps</option>
                <option value="blockchain-web3" style={{ color: '#1C1917' }}>Blockchain & Web3</option>
                <option value="gestion-projet" style={{ color: '#1C1917' }}>Gestion de Projet Digital</option>
                <option value="marketing-digital" style={{ color: '#1C1917' }}>Marketing Digital</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A8A29E' }} />
            </div>
            {errors.domain && <p className="text-xs text-red-500 mt-1">{errors.domain}</p>}
          </div>

          {/* Modules (displayed based on domain selection) */}
          {formData.domain && domainModules[formData.domain] && (
            <div>
              <label className="block text-sm font-normal mb-3" style={{ color: '#57534E' }}>
                Modules disponibles - Sélectionnez vos intérêts *
              </label>
              <div className="space-y-2">
                {domainModules[formData.domain].map((module) => (
                  <label
                    key={module}
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition"
                    style={{ 
                      backgroundColor: formData.modules.includes(module) ? '#A04000' : '#E5E5E5',
                      color: formData.modules.includes(module) ? '#FFFFFF' : '#57534E'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.modules.includes(module)}
                      onChange={() => handleModuleToggle(module)}
                      className="w-5 h-5 rounded accent-[#A04000]"
                    />
                    <span className="text-sm font-normal">{module}</span>
                  </label>
                ))}
              </div>
              {errors.modules && <p className="text-xs text-red-500 mt-2">{errors.modules}</p>}
            </div>
          )}

          {/* Objectif */}
          <div>
            <label className="block text-sm font-normal mb-2" style={{ color: '#57534E' }}>
              Objectif professionnel *
            </label>
            <div className="relative">
              <select 
                value={formData.objective}
                onChange={(e) => setFormData({...formData, objective: e.target.value})}
                className="w-full h-16 rounded-2xl px-5 text-base outline-none transition appearance-none cursor-pointer"
                style={{ backgroundColor: '#E5E5E5', color: formData.objective ? '#1C1917' : '#A8A29E' }}
              >
                <option value="" disabled style={{ color: '#A8A29E' }}>Choisir votre objectif</option>
                <option value="emploi" style={{ color: '#1C1917' }}>Trouver un emploi</option>
                <option value="freelance" style={{ color: '#1C1917' }}>Devenir freelance</option>
                <option value="certification" style={{ color: '#1C1917' }}>Obtenir une certification</option>
                <option value="evolution" style={{ color: '#1C1917' }}>Évoluer dans ma carrière</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A8A29E' }} />
            </div>
            {errors.objective && <p className="text-xs text-red-500 mt-1">{errors.objective}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl text-white text-base font-bold transition shadow-lg flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#A04000' }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                Créer mon profil SkillBadge
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          {errors.submit && <p className="text-xs text-red-500 text-center mt-2">{errors.submit}</p>}
        </form>

        {/* Legal Text */}
        <div className="mt-6 text-center text-xs leading-relaxed" style={{ color: '#78716C' }}>
          En vous inscrivant, vous acceptez nos{' '}
          <span className="font-semibold" style={{ color: '#A04000' }}>Conditions d'Utilisation</span>
          {' '}et <span className="font-semibold" style={{ color: '#A04000' }}>notre Politique de Confidentialité</span>.
        </div>

      </div>
    </div>
  )
}
