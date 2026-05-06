import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    isServiceMode: false,
    isSecurityMode: false
  }),

  actions: {
    toggleServiceMode() {
      this.isServiceMode = !this.isServiceMode
    },
    toggleSecurityMode() {
      this.isSecurityMode = !this.isSecurityMode
    }
  }
})
