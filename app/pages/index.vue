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
      <div class="page__avatar">
        <img class="page__avatar-image" :src="avatar" alt="User Avatar" />
      </div>
    </div>
    <div class="page__weather weather">
      <div class="page__column page__column--center">
        <div class="weather__block">
          <Icon class="weather__icon" :name="`noto:${weather.condition}`" />
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
      <Icon class="page__icon" name="i:community"></Icon>
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

const name = 'Alina'
const avatar =
  'https://instagram.fkiv9-1.fna.fbcdn.net/v/t51.82787-15/619334815_18074341892615625_5174968488304016953_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MjcwNTMyNzEzMjc2NDA2Njk2Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzMifQ%3D%3D&_nc_ohc=xsLSGmFKEQUQ7kNvwFp8EcO&_nc_oc=AdqusctNg7_lyyD0wCt0_DGSBkJ55uPM2_ssbm7Nd-3hfaV0g2vECJTiY2jDs37z97s&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fkiv9-1.fna&_nc_gid=BRsMc8QR1kTf-d1XUooMHA&_nc_ss=7a32e&oh=00_Af1g_dN8ME6SFfp3Nv9HV-agJLSROCOBtTRDe0bH_2huaw&oe=69D57F39'
const weather: Weather = {
  tempOutside: 28,
  tempIndoor: 18,
  condition: 'cloud-with-rain'
}
const slides = ref<Slide[]>([
  {
    id: 1,
    img: 'https://evolveartisanal.com/wp-content/uploads/2021/07/1_The-Wooden-Rhapsody-Modern-Bedroom-Interior-Design.jpg',
    routerLink: '/bedroom',
    title: 'bedroom'
  },
  {
    id: 2,
    img: 'https://hips.hearstapps.com/hmg-prod/images/1737-q54a-jm-0403-lowres-designer-jennifer-mcgee-67dc655a1d1ac.jpg?crop=0.8886666666666666xw:1xh;center,top&resize=1200:*',
    routerLink: '/bathroom',
    title: 'bathroom'
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
      color: rgba(#ffffff, 0.35);
    }

    &--temp {
      font-size: em(32);
      font-weight: bold;
    }

    &--celsius {
      position: absolute;
      top: em(10);
      right: em(6);
      color: rgba(#ffffff, 0.5);
      font-size: em(11);
    }
  }

  &__avatar {
    width: em(32);
    height: em(32);
    border-radius: 50%;
    border: em(1) solid #ccc;
    overflow: hidden;
    box-shadow: 0 4px 16px 3px rgba(#163b75, 0.7);
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
  }

  &__icon {
    width: em(24);
    height: em(24);
    margin-bottom: em(16);
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
      linear-gradient(rgba(#000000, 0.12), rgba(#000000, 0.12)) padding-box,
      linear-gradient(180deg, rgba(191, 140, 255, 0.23), rgba(0, 0, 0, 0))
        border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: em(50);
    height: em(50);
  }
}

.swiper {
  &__item {
    padding: em(12) em(12) em(28);
    background: rgba(255, 255, 255, 0.05);
    border-radius: em(12);
    border: em(1) solid rgba(#9c8cff, 0.36);
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
  }

  &__img {
    border-radius: em(10);
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
