'use client'

import { useState, useEffect } from 'react'
import { Camera, Building2, MapPin, Globe, Sun, Headphones, Save } from 'lucide-react'
import { useAuthStore } from '../../../store/auth'

const sectionIconClass = 'w-4 h-4 text-[#AB3500]'

export default function SettingsFormateur() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    organisation: '',
    linkedin: '',
    description: '',
    address: '',
    skills: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        organisation: (user as any).organisation || '',
        linkedin: (user as any).linkedin || '',
        description: (user as any).description || '',
        address: (user as any).address || '',
        skills: Array.isArray((user as any).skills) ? (user as any).skills.join(', ') : (user as any).skills || ''
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          organisation: formData.organisation,
          linkedin: formData.linkedin,
          description: formData.description,
          address: formData.address,
          skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        })
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuration
        </h1>
        <p className="text-sm text-gray-600">
          Gérer votre identité académique et preferences technique.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-green-700 text-sm font-medium">✅ Paramètres sauvegardés avec succès !</p>
        </div>
      )}

      {/* IDENTITÉ ACADÉMIQUE */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Camera className={sectionIconClass} aria-hidden="true" />
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            IDENTITÉ ACADÉMIQUE
          </h2>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-[#FFD4B8]">
              <Camera className="w-8 h-8 text-[#AB3500]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{formData.organisation || 'Nom de l\'organisation'}</h3>
              <p className="text-xs text-gray-600 mb-2">
                PNG or SVG, min 512x512px.
              </p>
              <button type="button" className="text-sm font-semibold hover:underline text-[#AB3500]" aria-label="Remplacer le logo de l'organisation">
                Remplacer Logo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Institution */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900">
            Institution
          </h2>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="formateur-organisation" className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                NOM DE L'INSTITUTION
              </label>
              <input 
                id="formateur-organisation"
                type="text" 
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                placeholder="Ex: Académie Numérique Burkina"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
              />
            </div>
            
            <div>
              <label htmlFor="formateur-linkedin" className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                LINKEDIN
              </label>
              <div className="relative">
                <input 
                  id="formateur-linkedin"
                  type="text" 
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/..."
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none pr-10 focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
                />
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="formateur-description" className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              DESCRIPTION DE L'INSTITUTION
            </label>
            <textarea 
              id="formateur-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre institution..."
              className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none resize-none min-h-[80px] focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
            />
          </div>

          <div>
            <label htmlFor="formateur-address" className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              ADRESSE PHYSIQUE
            </label>
            <div className="relative">
              <input 
                id="formateur-address"
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Avenue, Ville, Pays"
                className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none pl-10 focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* TECHNIQUE */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-[#AB3500]" aria-hidden="true" />
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            TECHNIQUE
          </h2>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="formateur-skills" className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              COMPÉTENCES
            </label>
            <input 
              id="formateur-skills"
              type="text" 
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Blockchain (séparés par des virgules)"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
            />
          </div>
        </div>
      </div>

      {/* ASSISTANCE */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-4 h-4 text-[#AB3500]" aria-hidden="true" />
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            ASSISTANCE
          </h2>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-sm text-gray-600 mb-4">
            Besoin d'aide avec votre node de validation? Contactez directement notre systeme administratif.
          </p>
          
          <div className="space-y-3 mb-4">
            <label htmlFor="formateur-support-subject" className="sr-only">Sujet du message</label>
            <input 
              id="formateur-support-subject"
              type="text" 
              placeholder="Sujet"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
            />
            <label htmlFor="formateur-support-message" className="sr-only">Message d'assistance</label>
            <textarea 
              id="formateur-support-message"
              placeholder="Comment nous pouvons vous aider aujourd'hui?"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm outline-none resize-none min-h-[80px] focus:bg-white focus:ring-2 focus:ring-orange-900 transition"
            />
          </div>

          <button type="button" className="w-full py-3 text-white font-bold rounded-lg hover:opacity-90 transition bg-[#AB3500]">
            Envoyer Message
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button 
        type="submit"
        disabled={loading}
        className="w-full py-4 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 bg-[#1A1A1A]"
        aria-label={loading ? 'Sauvegarde en cours' : 'Sauvegarder les paramètres'}
        title={loading ? 'Sauvegarde en cours' : 'Sauvegarder les paramètres'}
      >
        <Save className="w-5 h-5" />
        {loading ? 'Sauvegarde en cours...' : 'Sauvegarder'}
      </button>
    </form>
  )
}
