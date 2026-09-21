import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { useAuth } from './use-auth'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProfileContextType {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const currentUser = user

    if (!currentUser) {
      setProfile(null)
      return
    }

    let cancelled = false

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (cancelled) return

      if (error) {
        console.error('Failed to load profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider')
  }
  return context
}
