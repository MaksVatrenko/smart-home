<template>
  <div
    class="resize"
    :class="[
      currentProjectConfig?.name ? `js-is-${currentProjectConfig.name}` : '',
      { 'is-ready': isReady }
    ]"
    :style="rootStyle"
  >
    <!-- Debug mode for resizer info -->
    <div v-if="IS_DEBUG_MODE" class="resize__debug">
      <span
        v-for="(value, key) in currentProjectConfig"
        :key="key"
        class="resize__font"
      >
        {{ key }}: {{ value }}
      </span>
      <span class="resize__font">Current Size: {{ formattedFontSize }}px</span>
      <span class="resize__font">
        Viewport: {{ dimensions.width }}x{{ dimensions.height }}
      </span>
    </div>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResizer } from '@/composables/resizer'
import { IS_DEBUG_MODE } from '@/configs/global'

const { fontSize, currentProjectConfig, isReady, dimensions } = useResizer()

const formattedFontSize = computed(() => fontSize.value.toFixed(2))

// Use CSS variable for the calculated font size
// This is more performant than updating the inline font-size style directly on every frame
const rootStyle = computed(() => ({
  '--resizer-font-size': `${fontSize.value}px`,
  'font-size': 'var(--resizer-font-size)'
}))
</script>

<style scoped lang="scss">
.resize {
  position: relative;

  /* Initial state to prevent FOUC/Jumps */
  opacity: 0;

  /* 
     Performance optimization: 
     Transition is disabled by default for fluid scaling. 
     Fluid scaling is naturally smooth as it's updated on every animation frame.
     Adding a CSS transition on top of it creates a "laggy" feeling and causes layout thrashing.
  */
  transition: none;

  &.is-ready {
    opacity: 1;
    transition: opacity 0.3s ease-in;
  }

  &__debug {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    font-size: 12px;
    color: #fff;
    pointer-events: none;
    background: rgb(0 0 0 / 80%);
    border: 1px solid #002e74;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 50%);
  }

  &__font {
    font-family: monospace;
    white-space: nowrap;
  }
}
</style>
