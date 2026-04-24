<template>
  <footer class="footer">
    <div class="footer__wrapper">
      <nav>
        <ul class="footer__nav-list">
          <li
            v-for="item in navItems"
            :key="`nav-${item.href}`"
            class="footer__nav-item"
          >
            <NuxtLink
              :to="item.href"
              class="footer__nav-link"
              :class="{ 'footer__nav-link--active': route.path === item.href }"
            >
              <Icon
                v-if="route.path !== item.href"
                class="footer__icon"
                :name="item.icon"
              />
              <span v-if="route.path === item.href">
                {{ t(item.label) }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

type NavItem = {
  icon: string
  label: string
  href: string
}

const navItems: NavItem[] = [
  {
    icon: 'fluent:home-32-regular',
    label: 'home',
    href: '/'
  },
  // {
  //   icon: 'tabler:users',
  //   label: 'Users',
  //   href: '/users'
  // },
  // {
  //   icon: 'solar:shop-2-linear',
  //   label: 'Shop',
  //   href: '/shop'
  // },
  {
    icon: 'lucide:settings',
    label: 'settings',
    href: '/settings'
  }
]
</script>

<style scoped lang="scss">
.footer {
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: em(16) 0;
  }

  &__nav-list {
    display: flex;
    align-items: center;
    gap: em(55);
  }

  &__nav-item {
  }

  &__icon {
    width: em(24);
    height: em(24);
  }

  &__nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: em(11);
    &::before {
      content: '';
      display: block;
      opacity: 0;
      transition: opacity 0.3s ease;
      width: em(8);
      height: em(8);
      border-radius: 50%;
      background: linear-gradient(90deg, #469bff 0%, #8850ff 100%);
      box-shadow:
        0 0 16px 9px rgba(#3161fe, 0.49),
        0 0 7px 0 rgba(#3662ff, 0.96);
    }
    &--active {
      &::before {
        opacity: 1;
      }
    }
  }
}
</style>
