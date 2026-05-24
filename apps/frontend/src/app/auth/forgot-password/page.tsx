'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { auth, sendPasswordResetEmail } from '@/lib/firebase'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await sendPasswordResetEmail(auth, email)
      setSubmitted(true)
    } catch (err: any) {
      console.error('Erreur envoi email:', err)
      if (err.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email')
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide')
      } else {
        setError('Erreur lors de l\'envoi. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#57534E' }} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
        </div>

        {!submitted ? (
          <>
            {/* Description */}
            <div className="mb-6">
              <p className="text-base text-gray-700 leading-relaxed font-medium">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#374151' }}>
                  EMAIL
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full h-14 rounded-lg pl-12 pr-5 text-lg font-medium placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all border-2 border-gray-300"
                    style={{ backgroundColor: '#F5F5F5', color: '#1F2937' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg text-white text-sm font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#A04000', boxShadow: '0 4px 12px rgba(160, 64, 0, 0.3)' }}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => router.back()}
                className="text-sm font-semibold hover:underline"
                style={{ color: '#0E7490' }}
              >
                Retour à la connexion
              </button>
            </div>
          </>
        ) : (
          /* Success Message */
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(160, 64, 0, 0.1)' }}>
              <Mail className="w-8 h-8" style={{ color: '#A04000' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h2>
            <p className="text-sm text-gray-600 mb-6">
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
            </p>
            <button 
              onClick={() => router.push('/auth/login-talent')}
              className="w-full h-12 rounded-lg text-white text-sm font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ backgroundColor: '#A04000', boxShadow: '0 4px 12px rgba(160, 64, 0, 0.3)' }}
            >
              Retour à la connexion
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
