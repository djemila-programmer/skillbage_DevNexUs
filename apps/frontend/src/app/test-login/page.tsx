'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'

export default function TestLogin() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<'talent' | 'formateur' | null>(null)

  const handleLogin = () => {
    if (!selectedRole) return

    const mockUser = {
      id: selectedRole === 'talent' ? '1' : '2',
      email: selectedRole === 'talent' ? 'talent@example.com' : 'formateur@example.com',
      role: selectedRole as 'talent' | 'formateur',
    }

    setUser(mockUser)
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-orange-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <span className="text-2xl font-bold text-orange-800">SkillBadge</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test de Connexion
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Choisissez un rôle pour tester l'application
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            
            {/* Talent Card */}
            <button
              onClick={() => setSelectedRole('talent')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedRole === 'talent'
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Talent</h3>
              <p className="text-xs text-gray-600">
                Archad Ouédraogo<br />
                Développeur numérique
              </p>
            </button>

            {/* Formateur Card */}
            <button
              onClick={() => setSelectedRole('formateur')}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedRole === 'formateur'
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Formateur</h3>
              <p className="text-xs text-gray-600">
                Issa Kaboré<br />
                Académie Numérique
              </p>
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedRole
                ? 'bg-orange-800 text-white hover:bg-orange-900 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Se connecter
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Mode Test :</strong> Cette page permet de tester les deux interfaces (Talent et Formateur) sans authentification réelle.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
