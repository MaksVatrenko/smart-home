// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url))
  },

  pinia: {
    storesDirs: ['app/stores']
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    [
      '@nuxt/image',
      {
        quality: 80,
        format: ['webp'],
        screens: {
          xs: 320,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
          xxl: 1536
        }
      }
    ],
    'nuxt-svgo-loader'
  ],

  app: {
    head: {
      title: 'Smart Home',
      titleTemplate: '%s | Smart Home',
      htmlAttrs: { lang: 'uk' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            'Smart Home — управління розумним будинком: освітлення, клімат, безпека та пристрої в одному інтерфейсі.'
        },
        { name: 'theme-color', content: '#16171b' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Smart Home' },
        {
          property: 'og:title',
          content: 'Smart Home — управління розумним будинком'
        },
        {
          property: 'og:description',
          content:
            'Smart Home — управління розумним будинком: освітлення, клімат, безпека та пристрої в одному інтерфейсі.'
        },
        { property: 'og:image', content: '/og-image.png' },
        {
          property: 'og:url',
          content: 'https://smarthomevatrenko.netlify.app'
        },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Smart Home — управління розумним будинком'
        },
        {
          name: 'twitter:description',
          content:
            'Smart Home — управління розумним будинком: освітлення, клімат, безпека та пристрої в одному інтерфейсі.'
        },
        { name: 'twitter:image', content: '/og-image.png' },

        // Technical
        { name: 'robots', content: 'index, follow' },
        { name: 'msapplication-config', content: 'none' },
        { name: 'apple-mobile-web-app-capable', content: 'no' },
        { 'http-equiv': 'x-content-type-options', content: 'nosniff' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
        { rel: 'canonical', href: 'https://smarthomevatrenko.netlify.app' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    keepalive: false,
    buildAssetsDir: '/_nuxt/',
    baseURL: '/',
    cdnURL: ''
  },

  css: ['@/assets/scss/main.scss'],

  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
      cssCodeSplit: false
    },
    css: {
      devSourcemap: false, // Disable in production
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/scss/abstracts" as *;
        `
        }
      }
    },
    optimizeDeps: {
      include: ['@vueuse/core', 'vue-router', 'vue-i18n', 'gsap']
    },
    ssr: {
      noExternal: ['workbox-window', /vue-i18n/]
    }
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.VITE_BASE_URL || 'http://localhost:3000'
    }
  },

  typescript: {
    typeCheck: true,
    strict: true,
    shim: false
  },

  icon: {
    customCollections: [
      {
        prefix: 'i',
        dir: './app/assets/svg'
        // if you want to include all the icons in nested directories:
        // recursive: true,
      }
    ]
  }
})
