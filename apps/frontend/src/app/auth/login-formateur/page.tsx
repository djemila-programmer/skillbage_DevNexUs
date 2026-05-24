'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Award, Eye, EyeOff, Search, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function LoginFormateur() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Email ou mot de passe incorrect')
      }

      const data = await response.json()
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', data.token)
      
      // Vérifier s'il y a des données de profil dans localStorage
      const existingProfile = JSON.parse(localStorage.getItem('userProfileData') || 'null')
      
      // Fusionner les données (profil existant a priorité pour bio/liens)
      const mergedUser = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        fullName: data.user.fullName || data.user.email.split('@')[0],
        ...(existingProfile && existingProfile.id === data.user.id ? existingProfile : {})
      }
      
      setUser(mergedUser)
      
      // Rediriger selon le rôle
      if (data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log('Google login initiated')
    alert('Connexion Google - à configurer avec OAuth')
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      {/* Bouton Retour */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          
          {/* Left Side - Orange */}
          <div className="relative p-6 sm:p-8 flex flex-col justify-center min-h-[280px] md:min-h-[100%] overflow-hidden" style={{ backgroundColor: '#8B3103' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
            
            <div className="relative z-10">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-4">
                L&apos;excellence certifiée<br />
                au Burkina Faso.
              </h1>
              
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255, 200, 180, 0.9)' }}>
                Rejoignez le portail national des<br />
                compétences numériques.
              </p>
            </div>
            
            {/* Bottom Logo */}
            <div className="relative z-10 flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur opacity-30" style={{ backgroundColor: 'white' }} />
                <div className="relative w-12 h-12 rounded-full border-2 flex items-center justify-center" style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255, 200, 180, 0.9)' }}>NATIONAL PORTAL</div>
                <div className="text-sm font-medium text-white">Burkina Faso SkillBadge</div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Accès sécurisé</h2>
              <p className="text-xs sm:text-sm text-gray-600">Authentifiez-vous pour gérer vos credentials.</p>
            </div>

            {/* Tabs */}
            <div className="p-1 rounded-lg inline-flex mb-4 w-full" style={{ backgroundColor: '#F5F5F5' }}>
              <button className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all" style={{ backgroundColor: '#FFFFFF', color: '#8B3103', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                Se connecter
              </button>
              <button 
                onClick={() => router.push('/auth/register-formateur')}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-80 transition-all"
                style={{ color: '#78716C' }}
              >
                S&apos;inscrire
              </button>
            </div>

            {/* Google Button */}
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-lg border-2 inline-flex justify-center items-center gap-2 hover:shadow-md hover:border-gray-300 transition-all mb-3" 
              style={{ borderColor: '#E7E5E4' }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M18.8 10.2083C18.8 9.55831 18.7417 8.93331 18.6333 8.33331H10V11.8833H14.9333C14.7167 13.025 14.0667 13.9916 13.0917 14.6416V16.95H16.0667C17.8 15.35 18.8 13 18.8 10.2083Z" fill="#4285F4"/>
                <path d="M10 19.1667C12.475 19.1667 14.55 18.35 16.0667 16.95L13.0917 14.6417C12.275 15.1917 11.2333 15.525 10 15.525C7.61667 15.525 5.59167 13.9167 4.86667 11.75H1.81667V14.1167C3.325 17.1083 6.41667 19.1667 10 19.1667Z" fill="#34A853"/>
                <path d="M4.86667 11.7417C4.68334 11.1917 4.575 10.6083 4.575 10C4.575 9.39166 4.68334 8.80833 4.86667 8.25833V5.89166H1.81667C1.19167 7.125 0.833336 8.51666 0.833336 10C0.833336 11.4833 1.19167 12.875 1.81667 14.1083L4.19167 12.2583L4.86667 11.7417Z" fill="#FBBC05"/>
                <path d="M10 4.48331C11.35 4.48331 12.55 4.94998 13.5083 5.84998L16.1333 3.22498C14.5417 1.74165 12.475 0.833313 10 0.833313C6.41667 0.833313 3.325 2.89165 1.81667 5.89165L4.86667 8.25831C5.59167 6.09165 7.61667 4.48331 10 4.48331Z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700 text-sm font-semibold">Continuer avec Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ backgroundColor: '#E7E5E4' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A8A29E' }}>OU PAR EMAIL</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E7E5E4' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
              
              {/* Email */}
              <div className="relative">
                <label className="absolute left-4 -top-2.5 bg-white px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  EMAIL
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                  className="w-full h-12 rounded-lg px-5 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  style={{ backgroundColor: '#F5F5F5', color: '#57534E' }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#78716C' }}>
                    MOT DE PASSE
                  </label>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold hover:underline transition" 
                    style={{ color: '#0E7490' }}
                  >
                    Oublié ?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-14 rounded-xl px-5 pr-12 text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    style={{ backgroundColor: '#F5F5F5', color: '#57534E' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg text-white text-sm font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#A04000', boxShadow: '0 4px 12px rgba(160, 64, 0, 0.3)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: '#E7E5E4' }}>
              <button 
                onClick={() => router.push('/verify')}
                className="flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all"
                style={{ color: '#57534E' }}
              >
                <Search className="w-4 h-4" />
                Vérifier un talent
              </button>
              
              <div className="flex items-center gap-1 text-sm">
                <span style={{ color: '#A8A29E' }}>Pas encore inscrit ?</span>
                <button 
                  onClick={() => router.push('/auth/register-formateur')}
                  className="font-bold hover:underline"
                  style={{ color: '#8B3103' }}
                >
                  Créer un compte
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
