'use client'

import { Users, Award, TrendingUp, AlertCircle, CheckCircle, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

interface AdminStats {
  totalTrainers: number
  activeTrainers: number
  totalLearners: number
  totalBadges: number
  badgesThisWeek: number
  pendingApprovals: number
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Admin
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de la plateforme SkillBadge
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <Shield className="w-5 h-5 text-red-600" />
          <span className="text-sm font-semibold text-red-700">Super Admin</span>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {stats?.pendingApprovals && stats.pendingApprovals > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">
                {stats.pendingApprovals} demande{stats.pendingApprovals > 1 ? 's' : ''} en attente
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Des formateurs attendent votre validation pour rejoindre la plateforme
              </p>
              <Link
                href="/dashboard/admin/trainers"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
              >
                Voir les demandes
                <CheckCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#AB3500]" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Actifs
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats?.activeTrainers}
          </div>
          <p className="text-sm text-gray-500">Formateurs actifs</p>
          <p className="text-xs text-gray-400 mt-2">
            sur {stats?.totalTrainers} au total
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats?.totalLearners}
          </div>
          <p className="text-sm text-gray-500">Apprenants inscrits</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats?.totalBadges}
          </div>
          <p className="text-sm text-gray-500">Badges émis</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? '...' : stats?.badgesThisWeek}
          </div>
          <p className="text-sm text-gray-500">Badges cette semaine</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Actions rapides
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/trainers"
            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-[#AB3500] hover:bg-orange-50 transition group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-[#AB3500] transition">
              <Users className="w-6 h-6 text-[#AB3500] group-hover:text-white transition" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Gestion des Formateurs</h3>
              <p className="text-sm text-gray-500">Valider ou refuser les demandes</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/badges"
            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-[#AB3500] hover:bg-orange-50 transition group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-[#AB3500] transition">
              <Award className="w-6 h-6 text-blue-600 group-hover:text-white transition" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Gestion des Badges</h3>
              <p className="text-sm text-gray-500">Vue globale de tous les badges</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/statistics"
            className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-[#AB3500] hover:bg-orange-50 transition group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-[#AB3500] transition">
              <BarChart3 className="w-6 h-6 text-green-600 group-hover:text-white transition" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Statistiques Globales</h3>
              <p className="text-sm text-gray-500">Analytics et rapports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Chart Placeholder */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Évolution des badges émis (6 derniers mois)
        </h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
          <p className="text-gray-400">Graphique en cours de développement</p>
        </div>
      </div>
    </div>
  )
}
