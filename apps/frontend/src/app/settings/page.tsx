"use client"
import { useState } from 'react'
import { apiClient } from '../../lib/api-client'
import { useAuthStore } from '../../store/auth'

export default function SettingsPage() {
  const { user, setPreferences } = useAuthStore()
  const [language, setLanguage] = useState(user?.language || 'fr')
  const [theme, setTheme] = useState(user?.theme || 'light')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await apiClient.updateProfile({ language, theme })
      await setPreferences({ language, theme })
    } catch (e) {
      console.error('Erreur sauvegarde préférences', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>

      <section className="mb-6">
        <label className="block mb-2 font-medium">Langue</label>
        <select aria-label="Langue" value={language} onChange={(e) => setLanguage(e.target.value)} className="border rounded px-3 py-2">
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </section>

      <section className="mb-6">
        <label className="block mb-2 font-medium">Thème</label>
        <select aria-label="Thème" value={theme} onChange={(e) => setTheme(e.target.value)} className="border rounded px-3 py-2">
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
      </section>

      <button onClick={save} disabled={saving} className="bg-primary text-white px-4 py-2 rounded">
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </div>
  )
}
