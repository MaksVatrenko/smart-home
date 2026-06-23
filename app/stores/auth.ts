import { defineStore } from 'pinia'

const STORAGE_KEY = 'smarthome_auth'
const USERS_KEY = 'smarthome_users'
const AVATAR_KEY = 'smarthome_avatar'

type StoredUser = { name: string; email: string; password: string }

function getUsers(): StoredUser[] {
  if (!process.client) return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]): void {
  if (process.client) localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { name: string; email: string } | null,
    isAuthenticated: false,
    avatar: import.meta.client
      ? (localStorage.getItem(AVATAR_KEY) ?? 'https://cdn-icons-png.flaticon.com/512/147/147285.png')
      : 'https://cdn-icons-png.flaticon.com/512/147/147285.png'
  }),

  actions: {
    login(email: string, password: string): boolean {
      if (!email || password.length < 6) return false
      const users = getUsers()
      const found = users.find(u => u.email === email && u.password === password)
      if (!found) return false
      this.user = { name: found.name, email: found.email }
      this.isAuthenticated = true
      if (process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
      return true
    },

    register(name: string, email: string, password: string): boolean {
      if (!name || !email || password.length < 6) return false
      const users = getUsers()
      if (users.find(u => u.email === email)) return false
      users.push({ name, email, password })
      saveUsers(users)
      this.user = { name, email }
      this.isAuthenticated = true
      if (process.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
      return true
    },

    logout(): void {
      this.user = null
      this.isAuthenticated = false
      if (process.client) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(AVATAR_KEY)
      }
      this.avatar = 'https://cdn-icons-png.flaticon.com/512/147/147285.png'
      navigateTo('/login')
    },

    setAvatar(dataUrl: string): void {
      this.avatar = dataUrl
      if (process.client) localStorage.setItem(AVATAR_KEY, dataUrl)
    },

    restoreSession(): void {
      if (!process.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.user = JSON.parse(raw)
          this.isAuthenticated = true
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      const savedAvatar = localStorage.getItem(AVATAR_KEY)
      if (savedAvatar) this.avatar = savedAvatar
    }
  }
})
