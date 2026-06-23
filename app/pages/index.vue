<template>
  <div class="page">
    <div class="page__top">
      <div class="page__column">
        <span class="page__font page__font--title">
          {{ t('hi') + ' ' + name }}
        </span>
        <span class="page__font page__font--subtitle">
          {{ t('welcome') }}
        </span>
      </div>
      <div class="page__avatar" @click="messagesStore.openModal('AvatarModal')">
        <img
          class="page__avatar-image"
          :src="authStore.avatar"
          alt="User Avatar"
        />
      </div>
    </div>
    <div class="page__weather weather">
      <div class="page__column page__column--center">
        <div class="weather__block">
          <Icon
            v-if="!globalStore.isLightTheme"
            class="weather__icon"
            :name="`noto:${weather.condition}`"
          />
          <Icon
            v-else
            class="weather__icon"
            :name="`emojione-monotone:${weather.condition}`"
          />
        </div>
        <span class="page__font page__font--weather">
          {{ t(`weather.${weather.condition}`) }}
        </span>
      </div>
      <div class="page__column page__column--center">
        <div class="weather__block">
          <span class="page__font page__font--temp">
            {{ weather.tempOutside }}
          </span>
          <span class="page__font page__font--celsius">°C</span>
        </div>
        <span class="page__font page__font--weather">
          {{ t('tempOutside') }}
        </span>
      </div>
      <div class="page__column page__column--center">
        <div class="weather__block">
          <span class="page__font page__font--temp">
            {{ weather.tempIndoor }}
          </span>
          <span class="page__font page__font--celsius">°C</span>
        </div>
        <span class="page__font page__font--weather">
          {{ t('tempIndoor') }}
        </span>
      </div>
    </div>
    <div class="page__content">
      <div class="page__row">
        <Icon class="page__icon" name="mingcute:home-3-line"></Icon>
        <span class="page__font page__font--subtitle">
          {{ t('rooms') }}
        </span>
      </div>
      <div class="page__swiper-container swiper">
        <button type="button" @click="slidePrev">
          <Icon
            class="swiper__icon"
            name="material-symbols:arrow-back-ios-rounded"
          ></Icon>
        </button>
        <Swiper
          :navigation="true"
          :loop="true"
          :space-between="50"
          @swiper="onSwiper"
        >
          <SwiperSlide v-for="slide in slides" :key="slide.id">
            <NuxtLink class="swiper__item" :to="slide.routerLink">
              <NuxtImg class="swiper__img" :src="slide.img" alt="Slide Image" />
              <span class="swiper__title">
                {{ t(slide.title) }}
              </span>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
        <button type="button" @click="slideNext">
          <Icon
            class="swiper__icon"
            name="material-symbols:arrow-forward-ios-rounded"
          ></Icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import { useGlobalStore } from '@/stores/global'

import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'

definePageMeta({ middleware: 'auth' })

const globalStore = useGlobalStore()

const { t } = useI18n()

type Weather = {
  tempOutside: number
  tempIndoor: number
  condition:
    | 'cloud'
    | 'sun-behind-cloud'
    | 'cloud-with-rain'
    | 'sun-behind-rain-cloud'
    | 'cloud-with-lightning'
    | 'cloud-with-lightning-and-rain'
    | 'cloud-with-snow'
    | 'sun'
}

type Slide = {
  id: number
  img: string
  routerLink: string
  title: string
}
const authStore = useAuthStore()
const messagesStore = useMessagesStore()
const name = computed(() => authStore.user?.name ?? '')

const weather: Weather = {
  tempOutside: 28,
  tempIndoor: 18,
  condition: 'sun'
}
const slides = ref<Slide[]>([
  {
    id: 1,
    img: '/images/bedroom.jpg',
    routerLink: '/bedroom',
    title: 'bedroom'
  },
  {
    id: 2,
    img: '/images/bathroom.jpeg',
    routerLink: '/bathroom',
    title: 'bathroom'
  },
  {
    id: 3,
    img: '/images/kitchen.jpeg',
    routerLink: '/kitchen',
    title: 'kitchen'
  }
])

const swiperInstance = ref<any>(null)

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
}

function slidePrev() {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev()
  }
}

function slideNext() {
  if (swiperInstance.value) {
    swiperInstance.value.slideNext()
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  &__top {
    margin-top: em(60);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: em(10);
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: em(7);
    &--center {
      align-items: center;
    }
  }

  &__row {
    display: flex;
    align-items: center;
    gap: em(5);
    margin-bottom: em(16);
  }

  &__font {
    &--title {
      font-size: em(28);
      font-weight: bold;
    }

    &--subtitle {
    }

    &--weather {
      font-size: em(12);
      font-weight: lighter;
      color: rgba($color-text, 0.35);
    }

    &--temp {
      font-size: em(32);
      font-weight: bold;
    }

    &--celsius {
      position: absolute;
      top: em(10);
      right: em(6);
      color: rgba($color-text, 0.5);
      font-size: em(11);
    }
  }

  &__avatar {
    width: em(32);
    height: em(32);
    border-radius: 50%;
    border: em(1) solid $color-text;
    overflow: hidden;
    box-shadow: 0 4px 16px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__weather {
    margin-top: em(30);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: em(40);
    width: 100%;
  }

  &__icon {
    color: $color-text;
    width: em(24);
    height: em(24);
  }

  &__content {
    margin-top: em(28);
  }

  &__swiper-container {
    display: flex;
    gap: em(10);
  }
}

.weather {
  &__block {
    position: relative;
    width: em(64);
    height: em(64);
    backdrop-filter: blur(6px);
    border-radius: em(13);
    -webkit-backdrop-filter: blur(6px);
    border: em(1) solid transparent;
    background:
      linear-gradient($color-weather-block-bg, $color-weather-block-bg)
        padding-box,
      linear-gradient(180deg, rgba(0, 0, 0, 0), $color-weather-block-border)
        border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: em(40);
    height: em(40);
  }
}

.swiper {
  &__item {
    padding: em(12) em(12) em(28);
    background: $color-surface;
    border: em(1) solid rgba(#9c8cff, 0.2);
    border-radius: em(12);
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
  }

  &__img {
    border-radius: em(10);
    object-fit: cover;
    width: 100%;
    height: em(250);
    margin-bottom: em(20);
  }

  &__icon {
    width: em(20);
    height: em(20);
  }
}
</style>
