'use client'

import { Bookmark, Award, MapPin, ChevronRight, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'

interface SavedCandidate {
  id: string
  fullName: string
  email: string
  city?: string
  badgeCount: number
  recentBadges: Array<{
    name: string
    niveau: string
  }>
  savedAt: string
  privateNote?: string
}

export default function SavedCandidates() {
  const { user } = useAuthStore()
  const [candidates, setCandidates] = useState<SavedCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    fetchSavedCandidates()
  }, [])

  const fetchSavedCandidates = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/recruiter/saved-candidates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error('Error fetching saved candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeCandidate = async (candidateId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      await fetch(`${API_URL}/recruiter/saved-candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCandidates(prev => prev.filter(c => c.id !== candidateId))
    } catch (error) {
      console.error('Error removing candidate:', error)
    }
  }

  const saveNote = async (candidateId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      await fetch(`${API_URL}/recruiter/saved-candidates/${candidateId}/note`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note: noteText })
      })

      setCandidates(prev => 
        prev.map(c => c.id === candidateId ? { ...c, privateNote: noteText } : c)
      )
      setEditingNote(null)
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Candidats Sauvegardés
        </h1>
        <p className="text-gray-600">
          Vos profils mis de côté pour examen ultérieur
        </p>
      </div>

      {/* Candidates List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun candidat sauvegardé</h3>
          <p className="text-gray-600 mb-6">
            Recherchez des talents et sauvegardez les profils qui vous intéressent
          </p>
          <Link
            href="/dashboard/recruiter"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#AB3500] text-white rounded-lg font-semibold hover:bg-[#8B3103] transition"
          >
            Rechercher des talents
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-orange-900">
                      {candidate.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{candidate.fullName}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {candidate.badgeCount} badges
                      </span>
                    </div>
                    {candidate.city && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        {candidate.city}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {candidate.recentBadges.slice(0, 3).map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-sm">
                          <Award className="w-3 h-3 text-[#AB3500]" />
                          <span className="text-gray-700">{badge.name}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {badge.niveau}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/recruiter/candidate/${candidate.id}`}
                    className="px-4 py-2 bg-[#AB3500] text-white rounded-lg font-semibold text-sm hover:bg-[#8B3103] transition flex items-center gap-2"
                  >
                    Voir le profil
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => removeCandidate(candidate.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Private Note */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {editingNote === candidate.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Ajouter une note privée..."
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#AB3500] focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveNote(candidate.id)}
                        className="px-4 py-2 bg-[#AB3500] text-white rounded-lg text-sm font-semibold hover:bg-[#8B3103] transition"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {candidate.privateNote ? (
                        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                          <strong>Note privée :</strong> {candidate.privateNote}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Aucune note</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setEditingNote(candidate.id)
                        setNoteText(candidate.privateNote || '')
                      }}
                      className="text-[#AB3500] text-sm font-semibold hover:underline"
                    >
                      {candidate.privateNote ? 'Modifier' : 'Ajouter une note'}
                    </button>
                  </div>
                )}
              </div>

              {/* Saved Date */}
              <div className="mt-3 text-xs text-gray-400">
                Sauvegardé le {new Date(candidate.savedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
