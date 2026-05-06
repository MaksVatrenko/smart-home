<template>
  <div class="slider">
    <div
      ref="trackRef"
      class="slider__track"
      @mousedown="onTrackClick"
      @touchstart.prevent="onTrackClick"
    >
      <div class="slider__fill" :style="{ width: fillPercent + '%' }" />

      <div
        class="slider__thumb"
        :style="{ left: fillPercent + '%' }"
        :class="{ 'slider__thumb--dragging': isDragging }"
        role="slider"
        :aria-valuenow="modelValue"
        :aria-valuemin="min"
        :aria-valuemax="max"
        tabindex="0"
        @mousedown.stop="startDrag"
        @touchstart.stop.prevent="startDrag"
        @keydown="onKeydown"
      >
        <div class="slider__thumb-inner" />
        <div class="slider__tooltip">{{ modelValue }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const trackRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const fillPercent = computed(() => {
  const range = props.max - props.min
  if (range === 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

function valueFromEvent(event: MouseEvent | TouchEvent): number {
  if (!trackRef.value) return props.modelValue

  const touch =
    'touches' in event ? (event.touches[0] ?? event.changedTouches[0]) : null
  if ('touches' in event && !touch) return props.modelValue

  const clientX = touch ? touch.clientX : (event as MouseEvent).clientX

  const track = trackRef.value.getBoundingClientRect()
  const ratio = Math.min(Math.max((clientX - track.left) / track.width, 0), 1)
  const rawValue = props.min + ratio * (props.max - props.min)
  const stepped = Math.round(rawValue / props.step) * props.step
  return Math.min(
    props.max,
    Math.max(props.min, parseFloat(stepped.toFixed(10)))
  )
}

function emitValue(value: number) {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}

function onTrackClick(event: MouseEvent | TouchEvent) {
  emitValue(valueFromEvent(event))
  startDrag(event)
}

function startDrag(event: MouseEvent | TouchEvent) {
  isDragging.value = true

  const onMove = (e: MouseEvent | TouchEvent) => {
    emitValue(valueFromEvent(e))
  }

  const onUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    window.removeEventListener('touchmove', onMove)
    window.removeEventListener('touchend', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onUp)
}

function onKeydown(event: KeyboardEvent) {
  const stepMap: Record<string, number> = {
    ArrowRight: props.step,
    ArrowUp: props.step,
    ArrowLeft: -props.step,
    ArrowDown: -props.step,
    Home: props.min - props.modelValue,
    End: props.max - props.modelValue
  }

  const delta = stepMap[event.key]
  if (delta === undefined) return

  event.preventDefault()
  const next = Math.min(
    props.max,
    Math.max(props.min, props.modelValue + delta)
  )
  emitValue(next)
}
</script>

<style lang="scss" scoped>
$slider-color-fill: #4f46e5;
$slider-color-fill-dark: #3730a3;
$slider-color-track: #1e293b;
$slider-color-thumb: #ffffff;
$slider-color-shadow: rgba(79, 70, 229, 0.5);
$slider-color-muted: #64748b;
$slider-color-tooltip-bg: #020617;
$slider-color-tooltip-text: #e2e8f0;

$slider-track-height: 6;
$slider-thumb-size: 22;
$slider-thumb-border: 2.5;
$slider-thumb-margin: 4;

.slider {
  display: flex;
  flex-direction: column;
  gap: em(10);
  width: 100%;
  user-select: none;

  &__value {
    font-size: em(16);
    font-weight: 700;
    color: $slider-color-fill;
    letter-spacing: em(-0.5);
    transition: color 0.2s;
  }

  &__track {
    position: relative;
    height: em($slider-track-height);
    background: $slider-color-track;
    border-radius: em(999);
    cursor: pointer;
    margin: em($slider-thumb-margin) 0;
  }

  &__fill {
    position: absolute;
    inset: 0;
    right: auto;
    background: linear-gradient(
      90deg,
      $slider-color-fill-dark,
      $slider-color-fill
    );
    border-radius: em(999);
    transition: width 0.05s linear;
    pointer-events: none;
  }

  &__thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: em($slider-thumb-size);
    height: em($slider-thumb-size);
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: left 0.05s linear;

    &:focus {
      outline: none;
    }

    &--dragging {
      cursor: grabbing;

      .slider__thumb-inner {
        box-shadow: 0 0 0 em(4) $slider-color-shadow;
        transform: scale(1.18);
      }

      .slider__tooltip {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
    }

    &:hover,
    &:focus {
      .slider__thumb-inner {
        box-shadow: 0 0 0 em(5) $slider-color-shadow;
        transform: scale(1.16);
      }

      .slider__tooltip {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
    }
  }

  &__thumb-inner {
    width: em($slider-thumb-size);
    height: em($slider-thumb-size);
    background: $slider-color-thumb;
    border: em($slider-thumb-border) solid $slider-color-fill;
    border-radius: 50%;
    box-shadow: 0 0 0 em(3) transparent;
    transition:
      box-shadow 0.2s,
      transform 0.15s,
      border-color 0.2s;
  }

  &__tooltip {
    position: absolute;
    bottom: calc(100% + #{em(10)});
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    background: $slider-color-tooltip-bg;
    color: $slider-color-tooltip-text;
    font-family: 'JetBrains Mono', monospace;
    font-size: em(11);
    font-weight: 600;
    padding: em(3) em(8);
    border-radius: em(6);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition:
      opacity 0.15s,
      transform 0.15s;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: em(4) solid transparent;
      border-top-color: $slider-color-tooltip-bg;
    }
  }
}
</style>
