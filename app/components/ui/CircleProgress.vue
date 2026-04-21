<template>
  <div ref="container" class="progress">
    <svg
      :width="width"
      :height="width"
      :viewBox="`0 0 ${width} ${width}`"
      style="transform: rotate(-90deg)"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="bgColor"
        :stroke-width="strokeWidth"
        fill="none"
      />

      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke-linecap="round"
      />
    </svg>

    <div
      class="progress__dot"
      :style="{
        top: `${handleDotY - dotSize / 2}px`,
        left: `${handleDotX - dotSize / 2}px`
      }"
      @pointerdown="startDrag"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    modelValue?: number
  }>(),
  {
    min: 12,
    max: 28,
    modelValue: 12
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const width = 200
const center = width / 2
const radius = 80
const strokeWidth = 10
const dotSize = 24
const minAngle = 0
const maxAngle = Math.PI * 2

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const bgColor = '#1e2a4a'
const progressColor = '#3161FE'

const container = ref<HTMLElement | null>(null)

const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed({
  get() {
    const t = (props.modelValue - props.min) / (props.max - props.min)
    const angle = t * maxAngle
    return circumference * (1 - angle / (2 * Math.PI))
  },
  set(val: number) {
    const t = 1 - val / circumference
    const angle = t * 2 * Math.PI
    const clamped = clamp(angle, minAngle, maxAngle)
    const newT = clamped / maxAngle
    const newValue = Math.round(props.min + newT * (props.max - props.min))
    emit('update:modelValue', newValue)
  }
})

const progress = computed(() => {
  return 1 - strokeDashoffset.value / circumference
})

const angle = computed(() => {
  return progress.value * 2 * Math.PI
})

const correctedAngle = computed(() => {
  return -(Math.PI / 2 - angle.value)
})

const handleDotX = computed(() => {
  return center + radius * Math.cos(correctedAngle.value)
})

const handleDotY = computed(() => {
  return center + radius * Math.sin(correctedAngle.value)
})

const isDragging = ref(false)

const startDrag = () => {
  isDragging.value = true

  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', stopDrag)
}

const stopDrag = () => {
  isDragging.value = false

  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', stopDrag)
}

const onDrag = (event: PointerEvent) => {
  if (!isDragging.value || !container.value) return

  const rect = container.value.getBoundingClientRect()

  const centerX = rect.left + center
  const centerY = rect.top + center

  const dx = event.clientX - centerX
  const dy = event.clientY - centerY

  let angle = Math.atan2(dy, dx)

  if (angle < 0) {
    angle += 2 * Math.PI
  }

  angle += Math.PI / 2

  if (angle > 2 * Math.PI) {
    angle -= 2 * Math.PI
  }

  if (angle > maxAngle) {
    const distToMax = angle - maxAngle
    const distToMin = 2 * Math.PI - angle

    angle = distToMin < distToMax ? minAngle : maxAngle
  }

  const newProgress = angle / (2 * Math.PI)
  strokeDashoffset.value = circumference * (1 - newProgress)
}

onBeforeUnmount(() => {
  stopDrag()
})
</script>

<style scoped lang="scss">
.progress {
  position: relative;
  width: 200px;
  height: 200px;

  &__dot {
    touch-action: none;
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;

    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
    }
  }
}
</style>
