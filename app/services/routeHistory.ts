import { ref, type App } from 'vue'
import type { Router, RouteLocationNormalized } from 'vue-router'

export const ROUTE_HISTORY = Symbol('ROUTE_HISTORY')

export function createRouteHistoryPlugin(router: Router) {
  const history = ref<string[]>([])

  router.afterEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
      if (from.fullPath && from.fullPath !== to.fullPath) {
        history.value.push(from.fullPath)
      }
    }
  )

  return {
    install(app: App) {
      app.provide(ROUTE_HISTORY, history)
    }
  }
}
