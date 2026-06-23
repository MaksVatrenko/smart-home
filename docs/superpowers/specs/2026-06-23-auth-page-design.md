# Auth Page Design

**Date:** 2026-06-23  
**Feature:** Страница авторизации / регистрации

## Контекст

Nuxt 4 smart home приложение. Mock-аутентификация через Pinia store с persist в localStorage. Middleware защищает все страницы кроме `/login`.

## Архитектура

### Новые файлы

```
app/
├── layouts/
│   └── auth.vue                  # Чистый layout: только slot, без footer/modal/навигации
├── pages/
│   └── login.vue                 # Страница с табами Вход / Реєстрація
├── stores/
│   └── auth.ts                   # Pinia store: user, isAuthenticated
├── middleware/
│   └── auth.ts                   # Глобальный middleware: редирект → /login если не авторизован
└── components/auth/
    ├── LoginForm.vue             # Форма входа (email + password)
    └── RegisterForm.vue          # Форма регистрации (name + email + password)
```

### Изменения в существующих файлах

- `app/pages/index.vue` — добавить `definePageMeta({ middleware: 'auth' })`
- `app/pages/settings.vue` — добавить `definePageMeta({ middleware: 'auth' })`
- `app/pages/[room]/index.vue` — добавить `definePageMeta({ middleware: 'auth' })`
- `app/pages/[room]/ac.vue` — добавить `definePageMeta({ middleware: 'auth' })`
- `app/pages/shop.vue` — добавить `definePageMeta({ middleware: 'auth' })`
- `app/pages/users.vue` — добавить `definePageMeta({ middleware: 'auth' })`
- `app/locales/ua.json` — добавить ключи для auth
- `app/locales/en.json` — добавить ключи для auth

## Pinia Store: auth.ts

```ts
state: {
  user: { name: string; email: string } | null
  isAuthenticated: boolean
}

actions:
  login(email: string, password: string): void
    // Mock: любой email + password.length >= 6 → success
    // Сохраняет user в state и localStorage

  register(name: string, email: string, password: string): void
    // Mock: те же правила + name не пустой
    // Сохраняет user в state и localStorage

  logout(): void
    // Сбрасывает state, чистит localStorage, navigateTo('/login')

  restoreSession(): void
    // Читает localStorage при инициализации приложения
```

Persist: вручную через `localStorage.setItem/getItem` в actions (без pinia-plugin-persistedstate, т.к. он не подключён в проекте).

## Middleware: auth.ts

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

Применяется через `definePageMeta({ middleware: 'auth' })` на каждой защищённой странице.

## UI: login.vue

- `definePageMeta({ layout: 'auth' })` — отдельный layout без footer
- Центрированная карточка, стиль modal: `border: 1px solid rgba(90, 51, 255, 0.42)` + идентичный box-shadow
- Фон страницы: `$color-bg`
- Логотип/иконка умного дома + заголовок "Smart Home" сверху

### Табы

Два таба: "Увійти" / "Зареєструватись". Активный таб подсвечен градиентом `#5b6bff → #8b5cff`.

### LoginForm.vue

Поля: Email, Пароль. Кнопка "Увійти".

### RegisterForm.vue

Поля: Ім'я, Email, Пароль. Кнопка "Зареєструватись".

### Валидация

- Inline-ошибки под каждым полем, цвет `$color-red` из переменных
- Пустые поля: "Поле обов'язкове"
- Пароль < 6 символів: "Мінімум 6 символів"
- После успеха: `navigateTo('/')`

### Кнопка сабмита

Градиент фон `#5b6bff → #8b5cff` (цвета toggle-on из `_variables.scss`), белый текст, `border-radius: em(12)`.

## i18n ключи

```json
// ua.json
"auth": {
  "login": "Увійти",
  "register": "Зареєструватись",
  "email": "Пошта",
  "password": "Пароль",
  "name": "Ім'я",
  "required": "Поле обов'язкове",
  "minPassword": "Мінімум 6 символів",
  "title": "Smart Home"
}

// en.json
"auth": {
  "login": "Sign In",
  "register": "Sign Up",
  "email": "Email",
  "password": "Password",
  "name": "Name",
  "required": "Field is required",
  "minPassword": "Minimum 6 characters",
  "title": "Smart Home"
}
```

## layout: auth.vue

Минимальный layout: только `<slot />`, фон `$color-bg`, flex-центрирование карточки. Без `LayoutFooter`, `LayoutModal`, `LayoutResize`.
