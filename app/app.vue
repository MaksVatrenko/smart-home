<template>
  <div id="app" class="app">
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from './stores/global'
import { useAuthStore } from './stores/auth'

const globalStore = useGlobalStore()
const authStore = useAuthStore()

globalStore.initTheme()

onMounted(() => {
  authStore.restoreSession()
})
</script>

<style lang="scss">
.app {
  &__indicator {
    position: relative;
    z-index: 50;
    color: greenyellow;
  }
}

.page-enter-active,
.page-leave-active,
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to,
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
