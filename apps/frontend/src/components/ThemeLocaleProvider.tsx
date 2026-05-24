"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '../store/auth'

export default function ThemeLocaleProvider({ children }: { children: React.ReactNode }) {
  const { user, init } = useAuthStore()
  const pathname = usePathname()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    const apply = (language: string | undefined, theme: string | undefined) => {
      if (typeof document === 'undefined') return
      // language
      const lang = language || 'fr'
      document.documentElement.lang = lang
      // theme
      const th = theme || 'light'
      if (th === 'dark') {
        document.documentElement.classList.add('dark')
        document.body.classList.add('bg-gray-900', 'text-white')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('bg-gray-900', 'text-white')
      }
    }

    apply(user?.language, user?.theme)
  }, [user, pathname])

  return <>{children}</>
}
