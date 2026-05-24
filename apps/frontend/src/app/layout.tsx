import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import ThemeLocaleProvider from '../components/ThemeLocaleProvider'
export const metadata: Metadata = {
  title: 'SkillBadge - Certification Blockchain',
  description: 'La plateforme nationale pour certifier vos compétences tech sur la blockchain',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body className="bg-gray-50">
        <ThemeLocaleProvider>{children}</ThemeLocaleProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
