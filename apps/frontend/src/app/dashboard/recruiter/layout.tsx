'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, Users, Bookmark, LogOut, Menu } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    { href: '/dashboard/recruiter', label: 'Recherche de Talents', icon: Search },
    { href: '/dashboard/recruiter/saved', label: 'Candidats Sauvegardés', icon: Bookmark },
  ]

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#F5F5F5] border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#AB3500] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#AB3500]">Espace Recruteur</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">SKILLBADGE</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive 
                    ? 'bg-white text-[#AB3500] font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {isMounted && user ? (
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-900">
                  {user?.fullName?.charAt(0).toUpperCase() || 'R'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName || 'Recruteur'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-900">R</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Utilisateur</p>
                <p className="text-xs text-gray-500">Chargement...</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-[#AB3500]">SkillBadge</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const { logout } = useAuthStore.getState()
                logout()
                router.push('/')
              }}
              className="px-6 py-2 bg-[#1A1A1A] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
