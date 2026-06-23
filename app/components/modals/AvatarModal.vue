<template>
  <div class="avatar-modal">
    <div class="avatar-modal__preview-wrap">
      <img class="avatar-modal__preview" :src="preview" alt="Avatar" />
    </div>

    <label class="avatar-modal__upload">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="avatar-modal__input"
        @change="onFileChange"
      />
      <Icon name="material-symbols-light:upload-rounded" class="avatar-modal__upload-icon" />
      <span>{{ t('auth.uploadAvatar') }}</span>
    </label>

    <button class="avatar-modal__btn" :disabled="!changed" @click="save">
      {{ t('auth.saveAvatar') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'

const { t } = useI18n()
const auth = useAuthStore()
const messages = useMessagesStore()

const preview = ref(auth.avatar)
const changed = ref(false)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 200
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      const scale = Math.max(size / img.width, size / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
      preview.value = canvas.toDataURL('image/jpeg', 0.7)
      changed.value = true
    }
    img.src = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

function save() {
  auth.setAvatar(preview.value)
  messages.finishModalAnimation()
}
</script>

<style scoped lang="scss">
.avatar-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: em(20);
  padding: em(30) em(24);
  background: $color-bg;

  &__preview-wrap {
    width: em(110);
    height: em(110);
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(91, 107, 255, 0.5);
  }

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__upload {
    display: flex;
    align-items: center;
    gap: em(8);
    padding: em(10) em(20);
    font-size: em(14);
    font-weight: 600;
    color: $color-text;
    cursor: pointer;
    background: $color-bg-2;
    border: 1px solid rgba($color-text, 0.12);
    border-radius: em(10);
    transition: background 0.2s;

    &:hover {
      background: rgba(91, 107, 255, 0.1);
    }
  }

  &__upload-icon {
    width: em(20);
    height: em(20);
  }

  &__input {
    display: none;
  }

  &__btn {
    width: 100%;
    padding: em(12);
    font-size: em(15);
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(135deg, #5b6bff, #8b5cff);
    border: none;
    border-radius: em(12);
    transition: opacity 0.2s;

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }

    &:not(:disabled):hover {
      opacity: 0.9;
    }
  }
}
</style>
