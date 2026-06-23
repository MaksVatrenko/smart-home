import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  if (!process.client) return
  const auth = useAuthStore()
  if (!auth.isAuthenticated) auth.restoreSession()
  if (!auth.isAuthenticated) return navigateTo('/login')
})
