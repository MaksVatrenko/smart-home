<template>
  <div class="page">
    <h1 class="page__title">{{ t('settings') }}</h1>
    <div class="page__item">
      <Icon
        class="page__icon page__icon--lang"
        name="material-symbols-light:language"
      />
      <span class="page__font">{{ t('language') }}</span>
      <UiToggleSwitch v-model="isEnglish" class="page__toggle" />
    </div>
    <div class="page__item">
      <Icon class="page__icon page__icon--tools" name="ri:tools-line" />
      <span class="page__font">
        {{ t('service') }}
      </span>
      <button class="page__button" type="button">
        <Icon
          class="page__icon page__icon--tools"
          name="material-symbols-light:info-outline-rounded"
          @click="
            messagesStore.openModal('InfoModal', {
              title: 'service',
              info: 'info_1'
            })
          "
        />
      </button>
      <UiToggleSwitchBase v-model="first" class="page__toggle" />
    </div>
    <div class="page__item">
      <Icon
        class="page__icon page__icon--shield"
        name="material-symbols-light:shield-outline"
      />
      <span class="page__font">{{ t('security') }}</span>
      <button class="page__button" type="button">
        <Icon
          class="page__icon page__icon--tools"
          name="material-symbols-light:info-outline-rounded"
          @click="
            messagesStore.openModal('InfoModal', {
              title: 'security',
              info: 'info_2'
            })
          "
        />
      </button>
      <UiToggleSwitchBase v-model="second" class="page__toggle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { useMessagesStore } from '@/stores/messages'

const messagesStore = useMessagesStore()
const settingsStore = useSettingsStore()
const { locale, t } = useI18n()

const isEnglish = computed({
  get: () => locale.value === 'en',
  set: (val: boolean) => {
    locale.value = val ? 'en' : 'ua'
  }
})

const first = computed({
  get: () => settingsStore.isServiceMode,
  set: (val: boolean) => (settingsStore.isServiceMode = val)
})

const second = computed({
  get: () => settingsStore.isSecurityMode,
  set: (val: boolean) => (settingsStore.isSecurityMode = val)
})
</script>

<style lang="scss" scoped>
.page {
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
    align-items: center;
    gap: em(5);
    padding: em(15);
    background: rgba(255, 255, 255, 0.03);
    border-radius: em(12);
    position: relative;
  }

  &__toggle {
    flex: 0 0 auto;
  }

  &__font {
    flex: 1 1 auto;
  }

  &__icon {
    flex: 0 0 auto;
    top: 0;
    left: 0;
    width: em(30);
    height: em(30);
    opacity: 0.5;
    z-index: 0;
  }
}
</style>
