import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  schoolId: string | null
  setUser: (user: User | null) => void
  setSchoolId: (schoolId: string | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      schoolId: null,
      setUser: (user) => set({ user }),
      setSchoolId: (schoolId) => set({ schoolId }),
      clearUser: () => set({ user: null, schoolId: null }),
    }),
    {
      name: 'courtflow-user-storage',
    }
  )
)
