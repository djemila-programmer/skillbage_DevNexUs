'use client'

import DashboardTalent from './talent-dashboard'
import DashboardFormateur from './formateur/page'
import { useAuthStore } from '@/store/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  
  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    console.log(' Dashboard chargé - Rôle utilisateur:', user?.role)
    console.log('📦 User complet:', user)
    
    // Si pas d'utilisateur, essayer de charger depuis localStorage
    if (!user?.role && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log('♻️ Rechargement depuis localStorage:', parsedUser)
        setUser(parsedUser)
      }
    }
    
    // Marquer comme prêt après le chargement
    setIsReady(true)
  }, [])
  
  // Rediriger le recruteur vers son dashboard dédié
  useEffect(() => {
    if (isReady && user?.role === 'recruiter') {
      console.log('🎯 Redirection vers /dashboard/recruteur')
      router.replace('/dashboard/recruteur')
    }
  }, [isReady, user, router])
  
  // Afficher un loading pendant l'hydratation
  if (!isReady || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }
  
  // Si recruteur, on attend la redirection
  if (user.role === 'recruiter') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    )
  }
  
  const userType = user?.role === 'formateur' ? 'formateur' : 'talent'
  
  console.log('🎯 Type d\'utilisateur déterminé:', userType)

  return userType === 'talent' ? <DashboardTalent /> : <DashboardFormateur />
}
