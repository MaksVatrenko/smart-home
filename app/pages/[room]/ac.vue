<template>
  <div class="page">
    <AirConditioner class="page__conditioner" :room="room" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import AirConditioner from '~/components/AirConditioner.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const room = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments[0] as 'bathroom' | 'bedroom'
})
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  &__conditioner {
    margin-top: em(50);
  }
}
</style>
