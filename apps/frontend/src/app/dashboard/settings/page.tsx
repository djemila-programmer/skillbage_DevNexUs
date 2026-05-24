'use client'

import SettingsTalent from './talent-settings'
import SettingsFormateur from './formateur-settings'
import { useAuthStore } from '@/store/auth'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const userType = user?.role === 'formateur' ? 'formateur' : 'talent'

  return userType === 'talent' ? <SettingsTalent /> : <SettingsFormateur />
}
