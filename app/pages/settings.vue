<template>
  <div class="page">
    <h1 class="page__title">{{ t('settings') }}</h1>
    <div class="page__item">
      <span>{{ t('language') }}</span>
      <UiToggleSwitch v-model="isEnglish" class="page__toggle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const isEnglish = computed({
  get: () => locale.value === 'en',
  set: (val: boolean) => {
    locale.value = val ? 'en' : 'ua'
  }
})
</script>

<style lang="scss" scoped>
.page {
  padding: em(30);
  display: flex;
  flex-direction: column;
  gap: em(20);
  width: 100%;

  &__title {
    font-size: em(24);
    font-weight: bold;
    margin-bottom: em(20);
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: em(15);
    background: rgba(255, 255, 255, 0.05);
    border-radius: em(12);
  }
}
</style>
