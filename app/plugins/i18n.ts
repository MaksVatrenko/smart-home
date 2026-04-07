import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ua from '@/locales/ua.json'

export const locales = {
  ua: { name: 'Українська', code: 'ua' },
  en: { name: 'English', code: 'en' }
}

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { ua, en }
  })
  nuxtApp.vueApp.use(i18n)
})
