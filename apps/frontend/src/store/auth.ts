import { create } from 'zustand'

interface User {
  id: string
  skillBadgeId?: string
  email: string
  role: 'talent' | 'formateur' | 'recruiter'
  walletAddress?: string
  fullName?: string
  photoUrl?: string
  objective?: string
  githubUrl?: string
  linkedin?: string
  customPortfolioUrl?: string
  portfolioIsPublic?: boolean
  level?: string
  domain?: string
  modules?: string[]
  birthDate?: string
  createdAt?: string
  // preferences
  language?: 'fr' | 'en'
  theme?: 'light' | 'dark'
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setPreferences: (prefs: { language?: 'fr' | 'en'; theme?: 'light' | 'dark' }) => Promise<void>
  setIsLoading: (loading: boolean) => void
  logout: () => void
  init: () => void
}

export const useAuthStore = create<AuthStore>((set) => {
  return {
    user: null,
    isLoading: false,
    setUser: (user) => {
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          console.log('✅ User sauvegardé:', user.id, 'role:', user.role)
        } else {
          localStorage.removeItem('user')
          console.log(' User supprimé')
        }
      }
      set({ user })
    },
    setPreferences: async (prefs) => {
      // update local store and localStorage, and persist to backend if logged in
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user')
        let user = storedUser ? JSON.parse(storedUser) : null
        if (!user) return
        user = { ...user, ...prefs }
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
        // persist to backend
        try {
          const token = localStorage.getItem('token')
          if (token) {
            await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api') + '/users/profile', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(prefs),
            })
          }
        } catch (e) {
          console.error('Erreur persistance préférences:', e)
        }
      }
    },
    setIsLoading: (isLoading) => set({ isLoading }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
      console.log(' Déconnexion')
      set({ user: null })
    },
    init: () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            console.log('♻️ User chargé depuis localStorage:', user.id, 'role:', user.role)
            set({ user })
          } catch (error) {
            console.error('❌ Erreur parsing user:', error)
            localStorage.removeItem('user')
          }
        }
      }
    },
  }
})
