<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: $color-bg;
}
</style>
