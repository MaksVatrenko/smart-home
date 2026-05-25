<template>
  <div class="modal">
    <div class="modal__title">
      <span class="modal__font modal__font--title">
        {{ t(`${modalData.title}`) }}
      </span>
    </div>
    <div class="modal__info">
      <span class="modal__font modal__font--info">
        {{ t(`${modalData.info}`) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface ModalData {
  title: string
  info: string
}

defineProps<{
  modalData: ModalData
}>()
</script>

<style lang="scss" scoped>
.modal {
  padding: em(30) em(15);
  background: $color-black-10;
  display: flex;
  flex-direction: column;
  gap: em(10);
  &__title {
    align-self: center;
  }

  &__info {
  }

  &__font {
    color: $color-white;
    &--title {
      font-size: em(20);
    }

    &--info {
      font-size: em(14);
      opacity: 0.7;
    }
  }
}
</style>
