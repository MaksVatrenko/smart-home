import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import ua from '@/locales/ua.json'

export const locales = {
  ua: { name: 'Українська', code: 'ua' },
  en: { name: 'English', code: 'en' }
}

export default defineNuxtPlugin((nuxtApp) => {
  let locale = 'en'

  if (import.meta.client) {
    const saved = localStorage.getItem('locale')
    if (saved) locale = saved
  }

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { ua, en }
  })

  if (import.meta.client) {
    watch(i18n.global.locale, (val) => {
      localStorage.setItem('locale', val)
    })
  }

  nuxtApp.vueApp.use(i18n)
})
