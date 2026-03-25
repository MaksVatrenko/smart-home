<template>
  <div class="wrapper">
    <div ref="header" class="header" @click="toggle">
      <slot name="toggle-header"></slot>
    </div>

    <transition name="toggle" @enter="enter" @leave="leave">
      <div
        v-if="modelValue"
        ref="content"
        :class="{ 'absolute-overlay': overlay }"
        :style="contentStyle"
      >
        <slot name="toggle-content"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  overlay: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)
const header = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const headerHeight = ref(0)

const toggle = () => {
  isOpen.value = !isOpen.value
  emit('update:modelValue', isOpen.value)
}

const enter = (el: Element, done: () => void) => {
  requestAnimationFrame(() => {
    gsap.from(el, {
      height: 0,
      duration: 0.5,
      delay: 0.05,
      ease: 'power2.out',
      onComplete: done
    })
  })
}

const leave = (el: Element, done: () => void) => {
  gsap.to(el, {
    height: 0,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: done
  })
}

onMounted(() => {
  if (header.value) {
    headerHeight.value = (header.value as HTMLElement).offsetHeight
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue
    if (newValue && header.value) {
      nextTick(() => {
        headerHeight.value = (header.value as HTMLElement).offsetHeight
      })
    }
  }
)

const contentStyle = computed(() => ({
  top: '0',
  position: (props.overlay ? 'absolute' : 'relative') as 'absolute' | 'relative'
}))
</script>

<style scoped>
.wrapper {
  position: relative;
}

.header {
  cursor: pointer;
}

.absolute-overlay {
  position: absolute;
  right: 0;
  left: 0;
}

/* noinspection CssUnusedSymbol */
.toggle-enter-active,
.toggle-leave-active {
  overflow: hidden;
}
</style>
