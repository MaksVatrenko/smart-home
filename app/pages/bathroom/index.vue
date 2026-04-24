<template>
  <div class="page">
    <div class="page__top top">
      <NuxtImg
        class="top__img"
        src="https://hips.hearstapps.com/hmg-prod/images/1737-q54a-jm-0403-lowres-designer-jennifer-mcgee-67dc655a1d1ac.jpg?crop=0.8886666666666666xw:1xh;center,top&resize=1200:*"
      />
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
        :class="{
          'page__device--disabled': !device.isActive
        }"
      >
        <Icon
          :name="device.icon"
          class="page__device-img page__icon page__icon--device"
        />
        <span class="page__font page__font--device-name">
          {{ t(device.name) }}
        </span>
        <button
          class="page__device-btn"
          :class="{
            'page__device-btn--active': device.isActive
          }"
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
import { useDevicesStore, type DeviceName } from '@/stores/devices'
import { useRoute } from 'vue-router'

const acStore = useACStore()
const devicesStore = useDevicesStore()
const { t } = useI18n()
const route = useRoute()

const room = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments[0] as 'bathroom' | 'bedroom'
})

type Device = {
  name: string
  icon: string
  isActive: boolean
  routePath?: string
}

const devices = computed<Device[]>(() => [
  {
    name: 'light',
    icon: 'lets-icons:lamp',
    isActive: devicesStore[room.value].light.isActive
  },
  {
    name: 'exhaustFan',
    icon: 'ph:fan-light',
    isActive: devicesStore[room.value].exhaustFan.isActive
  },
  {
    name: 'boiler',
    icon: 'gg:smart-home-boiler',
    isActive: devicesStore[room.value].boiler.isActive
  }
])

const toggleDevice = (index: number) => {
  const device = devices.value[index]
  if (!device) return

  if (device.name === 'ac') {
    acStore.toggleAC(room.value)
  } else {
    devicesStore.toggleDevice(room.value, device.name as DeviceName)
  }
}
</script>

<style lang="scss" scoped>
.page {
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: em(19);
  }

  &__device {
    height: em(120);
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: em(10);
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
    position: relative;
    overflow: hidden;
    background: linear-gradient(to right, #354269, #3b3163);
    width: em(32);
    height: em(32);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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
      right: em(16);
    }
  }
}

.top {
  &__img {
    width: 100%;
    object-fit: cover;
    opacity: 0.8;
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
