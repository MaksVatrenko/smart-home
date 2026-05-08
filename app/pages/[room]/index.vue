<template>
  <div class="page">
    <div class="page__top top">
      <div
        class="top__img-wrapper"
        :class="`top__img-wrapper--${room}`"
        :style="{ '--lamp-opacity': lightOpacity }"
      >
        <NuxtImg class="top__img" :src="roomConfig.image" />
      </div>

      <template v-if="roomConfig.hasCamera">
        <div class="top__live">
          <div
            class="top__indicator"
            :class="{ 'top__indicator--disabled': !isCameraActive }"
          />
          <span class="page__font page__font--live">Live</span>
        </div>
        <div class="top__camera">
          <Icon
            class="page__icon page__icon--camera"
            name="material-symbols:photo-camera-rounded"
          />
        </div>
      </template>
    </div>

    <div class="page__devices-title">
      <Icon
        class="page__icon page__icon--devices"
        name="material-symbols:devices-other-outline"
      />
      <span class="page__font page__font--title">
        {{ t('devices') }}
      </span>
    </div>

    <div class="page__devices-list">
      <div
        v-for="(device, idx) in devices"
        :key="`${idx}${device.name}`"
        class="page__device"
        :class="{ 'page__device--disabled': !device.isActive }"
      >
        <Icon
          :name="device.icon"
          class="page__device-img page__icon page__icon--device"
        />
        <span class="page__font page__font--device-name">
          {{ t(device.name) }}
        </span>
        <UiBaseRangeSlider
          v-if="device.isDimmable"
          :model-value="getPercentLight(device.name as DeviceName)"
          :min="0"
          :max="100"
          :step="5"
          class="page__device-slider"
          :class="{ 'page__device-slider--active': device.isActive }"
          @update:model-value="
            updatePercentLight(device.name as DeviceName, $event)
          "
        />
        <button
          class="page__device-btn"
          :class="{ 'page__device-btn--active': device.isActive }"
          type="button"
          @click="toggleDevice(idx)"
        >
          <Icon
            class="page__icon page__icon--power"
            name="ic:round-power-settings-new"
          />
        </button>
        <NuxtLink
          v-if="device.routePath"
          class="page__device-btn page__device-btn--settings"
          :to="device.routePath"
        >
          <Icon class="page__icon page__icon--power" name="lucide:settings" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useACStore } from '@/stores/ac'
import {
  useDevicesStore,
  type DeviceName,
  type DevicesStoreState
} from '@/stores/devices'
import { useRoute } from 'vue-router'

// ─── Stores & helpers ────────────────────────────────────────────────────────

const acStore = useACStore()
const devicesStore = useDevicesStore()
const { t } = useI18n()
const route = useRoute()

// ─── Room detection ───────────────────────────────────────────────────────────

const room = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments[0] as 'bathroom' | 'bedroom' | 'kitchen'
})

// ─── Room config ──────────────────────────────────────────────────────────────

const ROOM_CONFIG = {
  bedroom: {
    image: '/images/bedroom.jpg',
    hasCamera: true
  },
  bathroom: {
    image: '/images/bathroom.jpeg',
    hasCamera: false
  },
  kitchen: {
    image: '/images/kitchen.jpeg',
    hasCamera: false
  }
} as const

const roomConfig = computed(() => ROOM_CONFIG[room.value])

// ─── Camera state ─────────────────────────────────────────────────────────────

const isCameraActive = computed(
  () => room.value === 'bedroom' && devicesStore.bedroom.smartCam.isActive
)

// ─── Devices list ─────────────────────────────────────────────────────────────

type Device = {
  name: DeviceName | 'ac'
  icon: string
  isActive: boolean
  routePath?: string
  isDimmable?: boolean
}

const BEDROOM_DEVICES = (acIsActive: boolean, roomPath: string): Device[] => [
  {
    name: 'bedLight',
    isDimmable: true,
    icon: 'iconoir:small-lamp-alt',
    isActive: devicesStore.bedroom.bedLight.isActive
  },
  {
    name: 'smartCam',
    icon: 'material-symbols:android-camera-outline',
    isActive: devicesStore.bedroom.smartCam.isActive
  },
  {
    name: 'wifi',
    icon: 'material-symbols:android-wifi-3-bar',
    isActive: devicesStore.bedroom.wifi.isActive
  },
  {
    name: 'ac',
    icon: 'iconoir:air-conditioner',
    isActive: acIsActive,
    routePath: `/${roomPath}/ac`
  }
]

const BATHROOM_DEVICES = (): Device[] => [
  {
    name: 'light',
    isDimmable: true,
    icon: 'iconoir:light-bulb',
    isActive: devicesStore.bathroom.light.isActive
  },
  {
    name: 'exhaustFan',
    icon: 'mdi:fan',
    isActive: devicesStore.bathroom.exhaustFan.isActive
  },
  {
    name: 'boiler',
    icon: 'mdi:water-boiler',
    isActive: devicesStore.bathroom.boiler.isActive
  }
]

const KITCHEN_DEVICES = (): Device[] => [
  {
    name: 'kitchenLight',
    isDimmable: true,
    icon: 'iconoir:light-bulb',
    isActive: devicesStore.kitchen.kitchenLight.isActive
  },
  {
    name: 'oven',
    icon: 'mdi:stove',
    isActive: devicesStore.kitchen.oven.isActive
  },
  {
    name: 'hood',
    icon: 'mdi:fan',
    isActive: devicesStore.kitchen.hood.isActive
  }
]

const devices = computed<Device[]>(() => {
  if (room.value === 'bedroom')
    return BEDROOM_DEVICES(acStore.bedroom.isActive, room.value)
  if (room.value === 'kitchen') return KITCHEN_DEVICES()
  return BATHROOM_DEVICES()
})

// ─── Toggle ───────────────────────────────────────────────────────────────────

const toggleDevice = (index: number) => {
  const device = devices.value[index]
  if (!device) return

  if (device.name === 'ac') {
    acStore.toggleAC(room.value)
  } else {
    devicesStore.toggleDevice(
      room.value,
      device.name as keyof DevicesStoreState[typeof room.value]
    )
  }
}

// ─── Light opacity  ───────────────────────

const lightOpacity = computed(() => {
  const state = devicesStore.$state[room.value]

  const dimmable = Object.values(state).find(
    (d) => d && typeof d === 'object' && 'percentLight' in d
  ) as { isActive: boolean; percentLight: number } | undefined

  if (!dimmable || !dimmable.isActive) return 0
  return dimmable.percentLight / 100
})
// ─── Percent light ────────────────────────────────────────────────────────────

function updatePercentLight(deviceName: DeviceName, value: number) {
  devicesStore.setPercentLight(
    room.value,
    deviceName as keyof DevicesStoreState[typeof room.value],
    value
  )
}

function getPercentLight(deviceName: DeviceName): number {
  const state = devicesStore.$state[room.value]

  if (deviceName in state) {
    const device = state[deviceName as keyof typeof state]
    if (device && 'percentLight' in device) {
      return (device as { percentLight: number }).percentLight
    }
  }

  return 0
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;

  &__top {
    height: em(188);
    border-radius: em(12);
    overflow: hidden;
    position: relative;
    margin: em(30) 0 em(24);
  }

  &__font {
    &--live {
      font-size: em(14);
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.9);
    }

    &--title {
      font-size: em(14);
      font-weight: bold;
      color: rgba(255, 255, 255, 0.85);
    }

    &--device-name {
      flex: 0 0 auto;
      font-size: em(12);
      font-weight: bold;
    }
  }

  &__icon {
    &--camera {
      width: em(20);
      height: em(20);
    }

    &--devices {
      width: em(24);
      height: em(24);
    }

    &--device {
      width: em(88);
      height: em(88);
      color: rgba(255, 255, 255, 0.03);
    }

    &--power {
      width: em(20);
      height: em(20);
    }
  }

  &__devices-title {
    display: flex;
    align-items: flex-end;
    gap: em(8);
    margin-bottom: em(24);
  }

  &__devices-list {
    display: flex;
    flex-direction: column;
    gap: em(20);
  }

  &__device {
    height: em(120);
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: em(20);
    border: em(1) solid transparent;
    border-radius: em(12);
    background: linear-gradient(rgba(0, 0, 0, 0.31), rgba(0, 0, 0, 0.31))
      padding-box;
    padding: em(12) em(16);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        linear-gradient(rgba(0, 0, 0, 0.31), rgba(0, 0, 0, 0.31)) padding-box,
        linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.08),
            rgba(156, 140, 255, 0.24)
          )
          border-box;
      opacity: 1;
      transition: opacity 0.3s ease;
      z-index: 0;
    }

    > * {
      position: relative;
      z-index: 1;
      transition: opacity 0.3s ease;
    }

    &--disabled {
      &::before {
        opacity: 0;
      }
    }
  }

  &__device-img {
    position: absolute;
    top: 0;
    left: 0;
  }

  &__device-btn {
    position: absolute;
    top: em(10);
    right: em(16);
    overflow: hidden;
    background: linear-gradient(to right, #354269, #3b3163);
    width: em(32);
    height: em(32);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(to right, #3161fe, #5a31fe);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 0;
    }

    > * {
      position: relative;
      z-index: 1;
      transition: opacity 0.3s ease;
    }

    &--active {
      &::before {
        opacity: 1;
      }
    }

    &--settings {
      position: absolute;
      top: em(10);
      right: em(56);
    }
  }

  &__device-slider {
    pointer-events: none;
    opacity: 0.5;
    transition: opacity 0.3s ease;

    &--active {
      pointer-events: auto;
      opacity: 1;
    }
  }
}

.top {
  &__img-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      z-index: 1;
      pointer-events: none;
      opacity: var(--lamp-opacity, 0.5);
      transition: opacity 0.3s ease;
    }

    &--bedroom {
      &::before,
      &::after {
        width: em(100);
        height: em(100);
        border-radius: 50%;

        background: radial-gradient(
          circle,
          rgba(255, 220, 120, 0.8) 0%,
          rgba(255, 220, 120, 0.4) 30%,
          rgba(255, 220, 120, 0.15) 55%,
          rgba(255, 220, 120, 0.05) 70%,
          rgba(255, 220, 120, 0) 100%
        );

        filter: blur(5px);
      }

      &::before {
        top: em(20);
        left: em(45);
      }

      &::after {
        top: em(20);
        right: em(40);
      }
    }

    &--bathroom {
      &::after,
      &::before {
        filter: blur(10px);
      }

      &::after {
        background: radial-gradient(
          circle,
          rgba(255, 220, 120, 0.8) 0%,
          rgba(255, 220, 120, 0.15) 80%,
          rgba(255, 220, 120, 0) 100%
        );
        border-radius: em(100) 0 0 em(100);
        width: em(300);
        height: em(40);
        top: em(85);
        left: em(40);
      }

      &::before {
        background: radial-gradient(
          circle,
          rgba(255, 220, 120, 0.8) 0%,
          rgba(255, 220, 120, 0.6) 50%,
          rgba(255, 220, 120, 0) 100%
        );
        border-radius: 0 0 em(50) em(50);
        width: em(40);
        height: em(20);
        top: em(55);
        left: em(0);
      }
    }

    &--kitchen {
      &::after {
        background: radial-gradient(
          circle,
          rgba(255, 220, 120, 0.8) 0%,
          rgba(255, 220, 120, 0.15) 80%,
          rgba(255, 220, 120, 0) 100%
        );
        width: em(200);
        height: em(50);
        top: em(20);
        left: em(80);
        filter: blur(8px);
      }

      &::before {
        background: radial-gradient(
          circle,
          rgba(255, 220, 120, 0.8) 0%,
          rgba(255, 220, 120, 0.15) 80%,
          rgba(255, 220, 120, 0) 100%
        );
        width: em(100);
        height: em(20);
        top: em(20);
        right: em(-30);
        filter: blur(8px);
      }
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
  }

  &__live {
    position: absolute;
    top: em(10);
    left: em(10);
    display: flex;
    gap: em(10);
    align-items: center;
    padding: em(7) em(10);
    border-radius: em(6);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
  }

  &__indicator {
    width: em(8);
    height: em(8);
    background: $color-green;
    border-radius: 50%;
    box-shadow:
      0 0 2.59px 0 rgba(2, 99, 0, 1),
      0 0 19.44px 0 rgba(69, 255, 143, 0.9),
      0 0 6.48px 0 rgba(0, 255, 102, 0.9);
    transition:
      background 0.3s ease,
      box-shadow 0.3s ease;

    &--disabled {
      background: $color-red;
      box-shadow:
        0 0 2.59px 0 rgba(120, 0, 0, 1),
        0 0 19.44px 0 rgba(255, 59, 48, 0.9),
        0 0 6.48px 0 rgba(255, 0, 0, 0.9);
    }
  }

  &__camera {
    position: absolute;
    bottom: em(15);
    right: em(15);
    width: em(40);
    height: em(40);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }
}
</style>
