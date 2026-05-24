'use client'

import { CheckCircle, XCircle, Clock, Eye, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface TrainerRequest {
  id: string
  fullName: string
  email: string
  organisation: string
  experience: string
  skills: string[]
  linkedin?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  justificatifPath?: string
  rejectionReason?: string
}

export default function ManageTrainers() {
  const { user } = useAuthStore()
  const [pendingRequests, setPendingRequests] = useState<TrainerRequest[]>([])
  const [approvedTrainers, setApprovedTrainers] = useState<TrainerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerRequest | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/admin/trainers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPendingRequests(data.pending || [])
        setApprovedTrainers(data.approved || [])
      }
    } catch (error) {
      console.error('Error fetching trainers:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveTrainer = async (trainerId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/admin/trainers/${trainerId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setPendingRequests(prev => prev.filter(t => t.id !== trainerId))
        fetchTrainers()
      }
    } catch (error) {
      console.error('Error approving trainer:', error)
    }
  }

  const rejectTrainer = async (trainerId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/admin/trainers/${trainerId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      })

      if (response.ok) {
        setPendingRequests(prev => prev.filter(t => t.id !== trainerId))
        setShowRejectModal(false)
        setRejectionReason('')
        fetchTrainers()
      }
    } catch (error) {
      console.error('Error rejecting trainer:', error)
    }
  }

  const suspendTrainer = async (trainerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir suspendre ce formateur ?')) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
        const token = localStorage.getItem('token')
        
        await fetch(`${API_URL}/admin/trainers/${trainerId}/suspend`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        fetchTrainers()
      } catch (error) {
        console.error('Error suspending trainer:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Formateurs
        </h1>
        <p className="text-gray-600">
          Valider les demandes et gérer les formateurs actifs
        </p>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Demandes en attente ({pendingRequests.length})
            </h2>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Aucune demande en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(trainer => (
              <div key={trainer.id} className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{trainer.fullName}</h3>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                        En attente
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-semibold text-gray-900">{trainer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Organisation</p>
                        <p className="font-semibold text-gray-900">{trainer.organisation}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expérience</p>
                        <p className="font-semibold text-gray-900">{trainer.experience} ans</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Compétences</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {trainer.skills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {trainer.linkedin && (
                      <a
                        href={trainer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-3"
                      >
                        Voir LinkedIn
                      </a>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Soumis le {new Date(trainer.submittedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => approveTrainer(trainer.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approuver
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTrainer(trainer)
                        setShowRejectModal(true)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Refuser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Trainers */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Formateurs actifs ({approvedTrainers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Organisation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Compétences</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {approvedTrainers.map(trainer => (
                <tr key={trainer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{trainer.fullName}</p>
                      <p className="text-sm text-gray-500">{trainer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{trainer.organisation}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {trainer.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {trainer.skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                          +{trainer.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => suspendTrainer(trainer.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Suspendre
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedTrainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Refuser la demande</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Vous refusez la demande de <strong>{selectedTrainer.fullName}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Motif du refus (optionnel)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Expliquez pourquoi la demande est refusée..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => rejectTrainer(selectedTrainer.id)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
