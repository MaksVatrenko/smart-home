import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    currentTime: Date.now(),
    isScrollLock: false,
    pageAnimation: '',
    isLightTheme: true
  }),

  actions: {
    toggleTheme() {
      this.isLightTheme = !this.isLightTheme
      const theme = this.isLightTheme ? 'light' : 'dark'
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    },

    initTheme() {
      if (!import.meta.client) return

      const saved = localStorage.getItem('theme')
      this.isLightTheme = saved !== 'dark'
      document.documentElement.setAttribute(
        'data-theme',
        this.isLightTheme ? 'light' : 'dark'
      )
    }
  }
})
