<template>
  <div class="layout">
    <LayoutResize class="layout__resize">
      <div class="layout__blur" />
      <!-- Skip to main content link for keyboard users -->
      <a href="/" class="skip-link">Skip to main content</a>

      <main id="main-content" class="layout__main container">
        <slot />
      </main>

      <LayoutFooter class="layout__footer" />
      <LayoutModal class="layout__modal" />
    </LayoutResize>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
/* Skip-link: visually hidden, but visible on focus */
.skip-link {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0, 0, 0, 0);
}

.skip-link:focus {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  width: auto;
  height: auto;
  padding: 1rem;
  margin: 0;
  color: greenyellow;
  white-space: normal;
  background-color: white;
  clip: auto;
}
</style>
