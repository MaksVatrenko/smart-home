<template>
  <div class="tabs">
    <div ref="tabsHeader" class="tabs__header">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        ref="tabRefs"
        class="tabs__item"
        :class="{ 'tabs__item--active': modelValue === tab.value }"
        @click="selectTab(tab.value)"
      >
        <Icon v-if="tab.icon" class="tabs__icon" :name="tab.icon" />
        {{ tab.label }}
      </button>

      <div class="tabs__indicator" :style="indicatorStyle" />
    </div>

    <div class="tabs__content">
      <slot :active="modelValue"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  type PropType
} from 'vue'

interface Tab {
  value: string
  label: string
  icon?: string
}

const props = defineProps({
  tabs: {
    type: Array as PropType<Tab[]>,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const tabRefs = ref<HTMLElement[]>([])
const tabsHeader = ref<HTMLElement | null>(null)

const indicator = ref({
  width: 0,
  left: 0
})

function updateIndicator() {
  const index = props.tabs.findIndex((t) => t.value === props.modelValue)

  const el = tabRefs.value[index]

  if (!el) return

  indicator.value = {
    width: el.offsetWidth,
    left: el.offsetLeft
  }
}

function selectTab(value: string) {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    updateIndicator()
  }
)

let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  updateIndicator()

  resizeObserver = new ResizeObserver(() => {
    updateIndicator()
  })

  if (tabsHeader.value) {
    resizeObserver.observe(tabsHeader.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

const indicatorStyle = computed(() => ({
  width: indicator.value.width + 'px',
  transform: `translateX(${indicator.value.left}px)`
}))
</script>

<style scoped lang="scss">
.tabs {
  &__header {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: em(8);
    padding: em(4);
    background: #f3f4f6;
    border-radius: em(40);
  }

  &__item {
    position: relative;
    z-index: 2;
    display: flex;
    gap: em(6);
    align-items: center;
    justify-content: center;
    padding: em(10) em(18);
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: em(40);
    transition: color 0.25s;

    &--active {
      color: white;
    }

    @media (max-width: $mobile) {
      padding: em(5) em(6);
    }
  }

  &__icon {
    width: em(26);
    height: em(26);
  }

  &__indicator {
    position: absolute;
    top: em(4);
    bottom: em(4);
    z-index: 1;
    background: #4f46e5;
    border-radius: em(40);
    transition:
      transform 0.35s ease,
      width 0.35s ease;
  }

  &__content {
    margin-top: em(20);
  }
}
</style>
