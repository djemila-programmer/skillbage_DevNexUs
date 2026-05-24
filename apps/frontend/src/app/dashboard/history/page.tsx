'use client'

import { Search, Filter, Award, Users, Calendar, ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function HistoriqueFormateur() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'validated' | 'pending' | 'revoked'>('all')
  
  const itemsPerPage = 10
  const totalItems = 45

  const historyData = [
    { id: 1, student: 'Moussa Bah', studentId: '#49201', badge: 'Développeur Fullstack', date: '24 Oct 2023', status: 'validated', level: 'Expert' },
    { id: 2, student: 'Awa Sow', studentId: '#49202', badge: 'Agri-Tech Manager', date: '23 Oct 2023', status: 'pending', level: 'Intermédiaire' },
    { id: 3, student: 'Jean Diop', studentId: '#49203', badge: 'Expert Solaire', date: '22 Oct 2023', status: 'validated', level: 'Avancé' },
    { id: 4, student: 'Fatou Diallo', studentId: '#49204', badge: 'UX Design', date: '21 Oct 2023', status: 'validated', level: 'Débutant' },
    { id: 5, student: 'Oumar Koné', studentId: '#49205', badge: 'React.js Developer', date: '20 Oct 2023', status: 'validated', level: 'Expert' },
    { id: 6, student: 'Mariam Traoré', studentId: '#49206', badge: 'Python Data Science', date: '19 Oct 2023', status: 'revoked', level: 'Intermédiaire' },
    { id: 7, student: 'Ibrahim Sanogo', studentId: '#49207', badge: 'Flutter / Dart', date: '18 Oct 2023', status: 'validated', level: 'Avancé' },
    { id: 8, student: 'Aïssatou Barry', studentId: '#49208', badge: 'Node.js Basics', date: '17 Oct 2023', status: 'pending', level: 'Débutant' },
    { id: 9, student: 'Sékou Camara', studentId: '#49209', badge: 'JavaScript ES6+', date: '16 Oct 2023', status: 'validated', level: 'Intermédiaire' },
    { id: 10, student: 'Kadiatou Diallo', studentId: '#49210', badge: 'TypeScript Avancé', date: '15 Oct 2023', status: 'validated', level: 'Expert' },
    { id: 11, student: 'Boubacar Sylla', studentId: '#49211', badge: 'DevOps Fundamentals', date: '14 Oct 2023', status: 'pending', level: 'Débutant' },
    { id: 12, student: 'Fatoumata Keita', studentId: '#49212', badge: 'Cloud Architecture', date: '13 Oct 2023', status: 'validated', level: 'Avancé' },
  ]

  const filteredData = historyData.filter(item => {
    const matchesSearch = item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.badge.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return { label: 'VALIDÉ', class: 'bg-green-100 text-green-700' }
      case 'pending':
        return { label: 'EN COURS', class: 'bg-yellow-100 text-yellow-700' }
      case 'revoked':
        return { label: 'RÉVOQUÉ', class: 'bg-red-100 text-red-700' }
      default:
        return { label: status.toUpperCase(), class: 'bg-gray-100 text-gray-700' }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Journal Blockchain
        </h1>
        <p className="text-sm text-gray-600">
          Historique immuable de toutes les transactions de certification enregistrées sur la blockchain.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            TOTAL ACTIONS
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            VALIDÉES
          </div>
          <div className="text-3xl font-bold text-green-600">38</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            EN COURS
          </div>
          <div className="text-3xl font-bold text-yellow-600">5</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            RÉVOQUÉES
          </div>
          <div className="text-3xl font-bold text-red-600">2</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un étudiant ou un badge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#AB3500]/20"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                filterStatus === 'all' 
                  ? 'bg-[#AB3500] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilterStatus('validated')}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                filterStatus === 'validated' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Validés
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                filterStatus === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours
            </button>
            <button 
              onClick={() => setFilterStatus('revoked')}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                filterStatus === 'revoked' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Révoqués
            </button>
          </div>

          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition flex items-center gap-2" title="Fonctionnalité à venir">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Badge
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((item) => {
                const statusBadge = getStatusBadge(item.status)
                const initials = item.student.split(' ').map(n => n[0]).join('')
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{item.student}</div>
                          <div className="text-xs text-gray-500">ID: {item.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#AB3500]" />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{item.badge}</div>
                          <div className="text-xs text-gray-500">{item.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/dashboard/badges/${item.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Voir les détails du badge"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} résultats
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition ${
                  currentPage === page
                    ? 'bg-[#AB3500] text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
