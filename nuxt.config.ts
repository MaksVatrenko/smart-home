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
      title: 'Welcome',
      titleTemplate: '%s - Nuxt',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            'A modern Nuxt 4 starter template with best practices and optimizations built-in'
        },
        { name: 'theme-color', content: '#00DC82' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Nuxt' },
        {
          property: 'og:description',
          content:
            'A modern Nuxt 4 starter template with best practices and optimizations built-in'
        },
        { property: 'og:image', content: '/og-image.jpg' },
        // Disable service worker
        { name: 'msapplication-config', content: 'none' },
        { name: 'apple-mobile-web-app-capable', content: 'no' },
        { 'http-equiv': 'x-content-type-options', content: 'nosniff' }
      ],
      link: [
        // { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // Enable transitions
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
