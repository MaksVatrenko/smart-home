<template>
  <div class="login-page">
    <div class="login-page__card">
      <div class="login-page__header">
        <img class="login-page__icon" src="/favicon.png" alt="Smart Home" />
        <span class="login-page__title">{{ t('auth.title') }}</span>
      </div>

      <div class="login-page__tabs">
        <button
          class="login-page__tab"
          :class="{ 'login-page__tab--active': activeTab === 'login' }"
          type="button"
          @click="activeTab = 'login'"
        >
          {{ t('auth.login') }}
        </button>
        <button
          class="login-page__tab"
          :class="{ 'login-page__tab--active': activeTab === 'register' }"
          type="button"
          @click="activeTab = 'register'"
        >
          {{ t('auth.register') }}
        </button>
      </div>

      <AuthLoginForm v-if="activeTab === 'login'" @success="navigateTo('/')" />
      <AuthRegisterForm v-else @success="navigateTo('/')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const activeTab = ref<'login' | 'register'>('login')
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  display: flex;
  justify-content: center;

  &__card {
    width: 100%;
    max-width: em(440);
    padding: em(26) em(28);
    background: $color-bg-2;
    border: em(1) solid rgba(90, 51, 255, 0.42);
    border-radius: em(14);
    box-shadow:
      0 -7.7px 18px 0 rgba(0, 45, 78, 0.21),
      0 -7.7px 18px 0 rgba(0, 17, 41, 0.2),
      41px -16px 108px 0 rgba(50, 97, 255, 0.51),
      -55.72px -10px 101.07px 0 rgba(90, 51, 255, 0.42);
    display: flex;
    flex-direction: column;
    gap: em(24);
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: em(8);
  }

  &__icon {
    width: em(60);
    height: em(60);
  }

  &__title {
    font-size: em(22);
    font-weight: 700;
    color: $color-text;
  }

  &__tabs {
    display: flex;
    border-radius: em(10);
    overflow: hidden;
    background: $color-bg;
  }

  &__tab {
    flex: 1;
    padding: em(10);
    font-size: em(14);
    font-weight: 600;
    color: $color-text-secondary;
    cursor: pointer;
    background: transparent;
    border: none;
    transition: all 0.2s;

    &--active {
      color: #fff;
      background: linear-gradient(135deg, #5b6bff, #8b5cff);
    }
  }
}
</style>
