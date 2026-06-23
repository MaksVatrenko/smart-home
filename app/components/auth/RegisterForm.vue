<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <div class="register-form__field">
      <FormsInput
        id="register-name"
        v-model="name"
        type="text"
        :label="t('auth.name')"
        :placeholder="t('auth.name')"
      />
      <span v-if="errors.name" class="register-form__error">{{ errors.name }}</span>
    </div>

    <div class="register-form__field">
      <FormsInput
        id="register-email"
        v-model="email"
        type="email"
        :label="t('auth.email')"
        :placeholder="t('auth.email')"
      />
      <span v-if="errors.email" class="register-form__error">{{ errors.email }}</span>
    </div>

    <div class="register-form__field">
      <FormsInput
        id="register-password"
        v-model="password"
        type="password"
        :label="t('auth.password')"
        :placeholder="t('auth.password')"
      />
      <span v-if="errors.password" class="register-form__error">{{ errors.password }}</span>
    </div>

    <span v-if="errors.general" class="register-form__error register-form__error--general">{{ errors.general }}</span>

    <button type="submit" class="register-form__btn">
      {{ t('auth.register') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const emit = defineEmits<{ success: [] }>()

const name = ref('')
const email = ref('')
const password = ref('')
const errors = reactive({ name: '', email: '', password: '', general: '' })

function validate(): boolean {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.general = ''
  let valid = true
  if (!name.value) { errors.name = t('auth.required'); valid = false }
  if (!email.value) { errors.email = t('auth.required'); valid = false }
  if (password.value.length < 6) { errors.password = t('auth.minPassword'); valid = false }
  return valid
}

function handleSubmit() {
  if (!validate()) return
  const ok = auth.register(name.value, email.value, password.value)
  if (ok) emit('success')
  else errors.general = t('auth.emailTaken')
}
</script>

<style scoped lang="scss">
.register-form {
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
