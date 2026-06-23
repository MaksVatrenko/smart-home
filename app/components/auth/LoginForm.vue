<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="login-form__field">
      <FormsInput
        id="login-email"
        v-model="email"
        type="email"
        :label="t('auth.email')"
        :placeholder="t('auth.email')"
      />
      <span v-if="errors.email" class="login-form__error">{{ errors.email }}</span>
    </div>

    <div class="login-form__field">
      <FormsInput
        id="login-password"
        v-model="password"
        type="password"
        :label="t('auth.password')"
        :placeholder="t('auth.password')"
      />
      <span v-if="errors.password" class="login-form__error">{{ errors.password }}</span>
    </div>

    <span v-if="errors.general" class="login-form__error login-form__error--general">{{ errors.general }}</span>

    <button type="submit" class="login-form__btn">
      {{ t('auth.login') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const emit = defineEmits<{ success: [] }>()

const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '', general: '' })

function validate(): boolean {
  errors.email = ''
  errors.password = ''
  errors.general = ''
  let valid = true
  if (!email.value) { errors.email = t('auth.required'); valid = false }
  if (password.value.length < 6) { errors.password = t('auth.minPassword'); valid = false }
  return valid
}

function handleSubmit() {
  if (!validate()) return
  const ok = auth.login(email.value, password.value)
  if (ok) emit('success')
  else errors.general = t('auth.invalidCredentials')
}
</script>

<style scoped lang="scss">
.login-form {
  display: flex;
  flex-direction: column;
  gap: em(16);

  &__field {
    display: flex;
    flex-direction: column;
    gap: em(4);
  }

  &__error {
    font-size: em(12);
    color: $color-red;
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

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
