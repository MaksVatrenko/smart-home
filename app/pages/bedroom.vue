<template>
  <div class="page">
    <AirConditioner class="page__conditioner" />
  </div>
</template>

<script setup lang="ts">
import AirConditioner from '~/components/AirConditioner.vue'

const temperature = ref(12)
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  &__conditioner {
    margin-top: em(50);
  }
}
</style>
