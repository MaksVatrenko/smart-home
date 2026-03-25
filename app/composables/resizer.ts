import { computed, onMounted, reactive, nextTick } from 'vue'
import resizerParams, { type ResizerConfig } from '@/configs/resizerParams'

const sortedConfigs = Object.values(resizerParams).sort(
  (a, b) => a.maxWidth - b.maxWidth
)

interface ResizerState {
  viewPortWidth: number
  viewPortHeight: number
  currentConfig: ResizerConfig
  isReady: boolean
}

// Shared state
const state = reactive<ResizerState>({
  // Default to a sensible width to avoid 0px font-size on initial load
  viewPortWidth: sortedConfigs[sortedConfigs.length - 1]?.width || 1440,
  viewPortHeight: 1080,
  currentConfig: (sortedConfigs[sortedConfigs.length - 1] ||
    sortedConfigs[0]) as ResizerConfig,
  isReady: false
})

let isInitialized = false

export function useResizer() {
  const isClient = typeof window !== 'undefined'

  const fontSize = computed(() => {
    const config = state.currentConfig

    // During SSR or before first client measurement, return the base font size
    if (!isClient || !state.isReady) {
      return config.fontSize
    }

    const scaleBy = config.scaleBy || 'width'
    let ratio = 1

    if (scaleBy === 'width') {
      const currentWidth = Math.max(config.minWidth || 0, state.viewPortWidth)
      ratio = currentWidth / config.width
    } else if (scaleBy === 'height') {
      const currentHeight = Math.max(
        config.minHeight || 0,
        state.viewPortHeight
      )
      ratio = currentHeight / (config.height || 1080)
    } else if (scaleBy === 'both') {
      const widthRatio =
        Math.max(config.minWidth || 0, state.viewPortWidth) / config.width
      const heightRatio =
        Math.max(config.minHeight || 0, state.viewPortHeight) /
        (config.height || 1080)
      ratio = Math.min(widthRatio, heightRatio)
    }

    let calculatedSize = config.fontSize * ratio

    if (config.maxFontSize)
      calculatedSize = Math.min(calculatedSize, config.maxFontSize)
    if (config.minFontSize)
      calculatedSize = Math.max(calculatedSize, config.minFontSize)

    return calculatedSize
  })

  function updateDimensions() {
    if (!isClient) return

    // Ensure we don't use 0 as width
    const newWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      state.currentConfig.width
    const newHeight =
      window.innerHeight || document.documentElement.clientHeight || 1080

    state.viewPortWidth = newWidth
    state.viewPortHeight = newHeight

    const newConfig = (sortedConfigs.find(
      (cfg) => state.viewPortWidth <= cfg.maxWidth
    ) ||
      sortedConfigs[sortedConfigs.length - 1] ||
      sortedConfigs[0]) as ResizerConfig

    if (state.currentConfig.name !== newConfig.name) {
      state.currentConfig = newConfig
    }
  }

  let ticking = false
  function resizeHandler() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateDimensions()
        ticking = false
      })
      ticking = true
    }
  }

  function visibilityHandler() {
    if (document.visibilityState === 'visible') {
      updateDimensions()
    }
  }

  // Use onMounted to ensure initialization happens on the client side only
  // and after the window object is stable.
  onMounted(() => {
    if (!isInitialized) {
      isInitialized = true

      // Force immediate measurement
      updateDimensions()

      // Delay setting isReady slightly to ensure the first render has valid dimensions
      nextTick(() => {
        state.isReady = true
      })

      window.addEventListener('resize', resizeHandler)
      window.addEventListener('visibilitychange', visibilityHandler)
      window.addEventListener('focus', updateDimensions)
    }
  })

  return {
    fontSize,
    currentProjectConfig: computed(() => state.currentConfig),
    isReady: computed(() => state.isReady),
    dimensions: computed(() => ({
      width: state.viewPortWidth,
      height: state.viewPortHeight
    }))
  }
}
