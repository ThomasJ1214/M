import { create } from 'zustand'

interface AppState {
  // Audio
  isMuted: boolean
  toggleMute: () => void

  // Theme
  theme: 'default' | 'racing-red'
  toggleTheme: () => void

  // Competition Mode (Konami)
  isCompetitionMode: boolean
  setCompetitionMode: (v: boolean) => void

  // Current model chapter (homepage)
  activeChapterIndex: number
  setActiveChapterIndex: (i: number) => void

  // Nav scrolled state
  isNavScrolled: boolean
  setNavScrolled: (v: boolean) => void

  // Launch control (fast scroll)
  isLaunchControl: boolean
  setLaunchControl: (v: boolean) => void

  // Mobile menu
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void

  // Loading
  assetsLoaded: boolean
  setAssetsLoaded: (v: boolean) => void

  // Gyroscope permission (mobile)
  gyroPermission: 'pending' | 'granted' | 'denied'
  setGyroPermission: (v: 'pending' | 'granted' | 'denied') => void
}

export const useAppStore = create<AppState>((set) => ({
  isMuted: true,
  toggleMute: () => set(s => ({ isMuted: !s.isMuted })),

  theme: 'default',
  toggleTheme: () => set(s => ({
    theme: s.theme === 'default' ? 'racing-red' : 'default'
  })),

  isCompetitionMode: false,
  setCompetitionMode: (v) => set({ isCompetitionMode: v }),

  activeChapterIndex: 0,
  setActiveChapterIndex: (i) => set({ activeChapterIndex: i }),

  isNavScrolled: false,
  setNavScrolled: (v) => set({ isNavScrolled: v }),

  isLaunchControl: false,
  setLaunchControl: (v) => set({ isLaunchControl: v }),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),

  assetsLoaded: false,
  setAssetsLoaded: (v) => set({ assetsLoaded: v }),

  gyroPermission: 'pending',
  setGyroPermission: (v) => set({ gyroPermission: v }),
}))
