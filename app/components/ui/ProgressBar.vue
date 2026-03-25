<template>
  <div class="progressbar">
    <span
      class="progressbar__line"
      :style="`width: ${props.percent}%`"
      :class="`progressbar__line--${props.lineColor}`"
    ></span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  percent: {
    type: Number,
    required: true
  },
  lineColor: {
    type: String,
    default: 'default'
  }
})
</script>

<style lang="scss" scoped>
.progressbar {
  position: relative;
  width: 100%;
  overflow: hidden;

  &__line {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: em(7);
    transition: all 0.3s ease-in-out;

    &--default {
      background: $color-accent;
    }

    &--blue {
      background: blue;
    }
  }
}
</style>
