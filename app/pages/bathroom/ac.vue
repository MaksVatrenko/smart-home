<template>
  <div class="page">
    <AirConditioner class="page__conditioner" room="bathroom" />
  </div>
</template>

<script setup lang="ts">
import AirConditioner from '~/components/AirConditioner.vue'
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  &__conditioner {
    margin-top: em(50);
  }
}
</style>
