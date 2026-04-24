<template>
  <div class="conditioner">
    <div class="conditioner__top">
      <div class="conditioner__column">
        <span class="conditioner__font conditioner__font--title">Turbo Ac</span>
        <span class="conditioner__font conditioner__font--subtitle">
          {{ t(`${props.room}`) }}
        </span>
      </div>
      <button
        class="conditioner__btn conditioner__btn--circle"
        :class="{ 'conditioner__btn--active': currentAC.isActive }"
        type="button"
        @click="acStore.toggleAC(props.room)"
      >
        <Icon
          class="conditioner__icon conditioner__icon--power"
          name="ic:round-power-settings-new"
        />
      </button>
    </div>
    <div class="conditioner__controls">
      <div
        v-for="control in controls"
        :key="control.label"
        class="conditioner__column conditioner__column--center"
      >
        <button
          class="conditioner__btn conditioner__btn--square"
          :class="{
            'conditioner__btn--active':
              control.mode === currentAC.mode && currentAC.isActive,
            'conditioner__btn--disabled': !currentAC.isActive
          }"
          type="button"
          @click="setMode(control.mode)"
        >
          <Icon
            class="conditioner__icon conditioner__icon--control"
            :name="control.icon"
          />
        </button>
        <span class="conditioner__font conditioner__font--control">
          {{ t(control.label) }}
        </span>
      </div>
    </div>
    <div
      class="conditioner__ac ac"
      :class="{ 'conditioner__ac--disabled': !currentAC.isActive }"
    >
      <div class="ac__stick" />
      <div class="ac__stick" />
      <div class="ac__stick" />
      <div class="ac__stick" />
      <div class="ac__circle" />
      <div class="ac__circle" />
      <div
        class="ac__indicator"
        :class="{ 'ac__indicator--disabled': !currentAC.isActive }"
      />
      <UiCircleProgress v-model="temperature" :min="16" :max="30" />
      <div class="ac__temp">
        <span class="ac__font ac__font--temp">
          {{ temperature }}
        </span>
        <span class="ac__font ac__font--celcium">&#8451;</span>
      </div>
    </div>
    <div class="conditioner__grid">
      <div class="conditioner__block block block--column">
        <span class="conditioner__font conditioner__font--block-1">
          {{ t('tempIndoor') }}
        </span>
        <span>
          <span class="conditioner__font conditioner__font--block-2">18</span>
          <span class="conditioner__font conditioner__font--block-3">
            &#8451;
          </span>
        </span>
      </div>
      <div class="conditioner__block block block--column">
        <span class="conditioner__font conditioner__font--block-1">
          {{ t('tempOut') }}
        </span>
        <span>
          <span class="conditioner__font conditioner__font--block-2">30</span>
          <span class="conditioner__font conditioner__font--block-3">
            &#8451;
          </span>
        </span>
      </div>
      <div class="conditioner__block block block--column">
        <span class="conditioner__font conditioner__font--block-1">
          {{ t('windSpeed') }}
        </span>
        <span>
          <span class="conditioner__font conditioner__font--block-2">2</span>
          <span class="conditioner__font conditioner__font--block-3">
            {{ t('grade') }}
          </span>
        </span>
      </div>
      <div class="conditioner__block block block--row">
        <div class="block__column">
          <span class="conditioner__font conditioner__font--block-2">
            {{ t('fan') }}
          </span>
          <span class="conditioner__font conditioner__font--block-3">
            {{ fanIsActive ? t('on') : t('off') }}
          </span>
        </div>
        <UiToggleSwitchBase v-model="fanIsActive" />
      </div>
      <div class="conditioner__block block block--row">
        <div class="block__column">
          <span class="conditioner__font conditioner__font--block-2">
            {{ t('cooler') }}
          </span>
          <span class="conditioner__font conditioner__font--block-3">
            {{ coolerIsActive ? t('on') : t('off') }}
          </span>
        </div>
        <UiToggleSwitchBase v-model="coolerIsActive" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useACStore, type ACMode } from '@/stores/ac'

const props = defineProps<{
  room: 'bathroom' | 'bedroom'
}>()

const acStore = useACStore()
const { t } = useI18n()

const currentAC = computed(() => acStore[props.room])

type Control = {
  mode: ACMode
  icon: string
  label: string
}

const temperature = computed({
  get: () => currentAC.value.temperature,
  set: (val: number) => {
    acStore.setACField(props.room, 'temperature', val)
  }
})

const fanIsActive = computed({
  get: () => currentAC.value.fanIsActive,
  set: (val: boolean) => {
    acStore.setACField(props.room, 'fanIsActive', val)
  }
})

const coolerIsActive = computed({
  get: () => currentAC.value.coolerIsActive,
  set: (val: boolean) => {
    acStore.setACField(props.room, 'coolerIsActive', val)
  }
})

const controls = ref<Control[]>([
  {
    mode: 'cool',
    icon: 'gravity-ui:snowflake',
    label: 'cool'
  },
  {
    mode: 'heat',
    icon: 'material-symbols:heat',
    label: 'heat'
  },
  {
    mode: 'wind',
    icon: 'tabler:windmill',
    label: 'wind'
  },
  {
    mode: 'auto',
    icon: 'iconamoon:playlist-repeat-list-fill',
    label: 'auto'
  }
])

const setMode = (mode: ACMode) => {
  acStore.setMode(props.room, mode)
}
</script>

<style lang="scss" scoped>
.conditioner {
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: em(16);
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: em(5);
    position: relative;
    z-index: 1;
    &--center {
      align-items: center;
    }
  }

  &__font {
    &--title {
      font-size: em(16);
      font-weight: bold;
    }

    &--subtitle {
      font-size: em(14);
      color: rgba($color-white, 0.8);
      font-weight: 300;
    }

    &--control {
      font-size: em(10);
      font-weight: 500;
    }

    &--block-1 {
      color: rgba(255, 255, 255, 0.75);
      font-size: em(12);
    }

    &--block-2 {
      font-size: em(16);
    }

    &--block-3 {
      color: rgba(255, 255, 255, 0.5);
      font-size: em(12);
    }
  }

  &__btn {
    position: relative;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(to right, #354269, #3b3163);

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

    &--circle {
      width: em(28);
      height: em(28);
      border-radius: 50%;
    }

    &--square {
      width: em(46);
      height: em(46);
      border-radius: em(8);
    }

    &--active {
      &::before {
        opacity: 1;
      }
    }

    &--disabled {
      background: linear-gradient(to right, #2c2c2c, #3b3b3b);
      pointer-events: none;
      > * {
        opacity: 0.5;
      }

      &::before {
        opacity: 0;
      }
    }
  }

  &__icon {
    &--power {
      width: em(18);
      height: em(18);
    }

    &--control {
      width: em(24);
      height: em(24);
    }
  }

  &__controls {
    position: relative;
    display: flex;
    justify-content: center;
    gap: em(32);
    padding: em(14) 0;
    border-radius: em(12);
    border: 1px solid transparent;
    background:
      linear-gradient($color-black-10, $color-black-10) padding-box,
      linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.08),
          rgba(156, 140, 255, 0.24)
        )
        border-box;
    overflow: hidden;
    margin-bottom: em(70);
    &::before {
      content: '';
      position: absolute;
      z-index: 0;
      bottom: -30%;
      left: 50%;
      transform: translateX(-50%) translateY(30%);
      width: em(154);
      height: em(154);
      border-radius: 50%;
      background: rgba(46, 89, 230, 0.35);
      filter: blur(61px);
    }

    &:hover::before {
      opacity: 1;
    }
  }

  &__ac {
    opacity: 1;
    transition: opacity 0.3s ease;
    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__grid {
    margin-top: em(30);
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: em(21);
    grid-row-gap: em(12);
    & > *:nth-child(1) {
      grid-area: 1 / 1 / 2 / 3;
    }

    & > *:nth-child(2) {
      grid-area: 1 / 3 / 2 / 5;
    }

    & > *:nth-child(3) {
      grid-area: 1 / 5 / 2 / 7;
    }

    & > *:nth-child(4) {
      grid-area: 2 / 1 / 3 / 4;
    }

    & > *:nth-child(5) {
      grid-area: 2 / 4 / 3 / 7;
    }
  }

  &__block {
  }
}

.ac {
  position: relative;
  width: 190px;
  height: 190px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 -7.7px 18px 0 rgba(0, 45, 78, 0.21),
    0 -7.7px 18px 0 rgba(0, 17, 41, 0.2),
    41px -16px 108px 0 rgba(50, 97, 255, 0.51),
    -55.72px -10px 101.07px 0 rgba(90, 51, 255, 0.42);
  border-radius: 50%;
  &__stick {
    position: absolute;
    background: rgba(255, 255, 255, 0.2);

    &:nth-child(1),
    &:nth-child(4) {
      width: em(3);
      height: em(10);
      transform: translateX(-50%);
    }

    &:nth-child(2),
    &:nth-child(3) {
      width: em(10);
      height: em(3);
      transform: translateY(-50%);
    }

    &:nth-child(1) {
      top: -15px;
      left: 50%;
    }

    &:nth-child(2) {
      top: 50%;
      left: -15px;
    }

    &:nth-child(3) {
      top: 50%;
      right: -15px;
    }

    &:nth-child(4) {
      bottom: -15px;
      left: 50%;
    }
  }

  &__circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    &:nth-child(5) {
      width: 190px;
      height: 190px;
      background: linear-gradient(to bottom, #131a33, rgba(#131a33, 0.8));
    }

    &:nth-child(6) {
      width: 130px;
      height: 130px;
      background: rgba(21, 29, 60, 1);
      box-shadow: 0 5.18px 15.55px 0 rgba(0, 0, 0, 0.85);
    }
  }

  &__temp {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__font {
    &--temp {
      font-size: 46px;
      font-weight: bold;
    }

    &--celcium {
      position: absolute;
      top: em(-10);
      right: em(-16);
      color: rgba(#ffffff, 0.5);
      font-size: 17px;
    }
  }

  &__indicator {
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
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
}

.block {
  border: 1px solid transparent;
  background:
    linear-gradient($color-black, $color-black) padding-box,
    linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.08),
        rgba(156, 140, 255, 0.24)
      )
      border-box;
  border-radius: em(12);
  padding: em(17) em(12);
  display: flex;

  &--column {
    flex-direction: column;
    gap: em(12);
  }

  &--row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: em(4);
  }
}
</style>
