import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

export const locales = {
  ru: { name: 'Русский', code: 'ru' },
  en: { name: 'English', code: 'en' }
}

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { ru, en }
  })
  nuxtApp.vueApp.use(i18n)
})
