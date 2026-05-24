'use client'

import { useAuthStore } from '@/store/auth'
import { useState, useEffect } from 'react'
import PortfolioContent from '@/components/portfolio-content'

interface Badge {
  id: string
  name: string
  description: string
  skills: string | string[]
  niveau?: string
  status: string
  issuedAt: string
  issuer?: {
    fullName: string
  }
}

export default function Portfolio() {
  const { user } = useAuthStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBadges()
  }, [user?.id])

  const fetchBadges = async () => {
    if (!user?.id) return
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/badges/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBadges(data)
      }
    } catch (error) {
      console.error('Error fetching badges:', error)
    } finally {
      setLoading(false)
    }
  }

  const displayUser = user

  return (
    <PortfolioContent 
      userData={displayUser}
      badges={badges}
      loading={loading}
    />
  )
}
