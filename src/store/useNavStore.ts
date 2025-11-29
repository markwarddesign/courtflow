import { create } from 'zustand'

interface NavState {
  currentView: string
  setCurrentView: (view: string) => void
}

export const useNavStore = create<NavState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
}))
