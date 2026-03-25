<template>
  <div id="app" class="app">
    <!-- Accessibility route announcer for screen readers -->
    <NuxtRouteAnnouncer />

    <!-- Global loading indicator -->
    <!--    <NuxtLoadingIndicator :height="2" class="app__indicator" />-->

    <!-- Main layout wrapper -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts"></script>

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
