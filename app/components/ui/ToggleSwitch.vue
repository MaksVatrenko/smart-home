<template>
  <button
    type="button"
    class="toggle"
    :class="{ 'toggle--on': model }"
    role="switch"
    :aria-checked="model"
    @click="toggle"
  >
    <span class="toggle__text">OFF</span>

    <span class="toggle__slider" />

    <span class="toggle__text">ON</span>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'change'])

const model = defineModel({
  type: Boolean,
  default: false
})

function toggle() {
  model.value = !model.value
  emit('change', model.value)
}
</script>

<style scoped lang="scss">
.toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: em(106);
  height: em(34);
  padding: 0 em(12);
  cursor: pointer;
  background: $color-white;
  border: none;
  border-radius: em(20);
  box-shadow: 4px 4px 6px 0 rgb(0 35 104 / 19%);
  transition: background 0.25s ease;

  &__slider {
    position: absolute;
    left: em(3);
    width: em(50);
    height: calc(100% - #{em(6)});
    background: grey;
    border-radius: em(40);
    transition:
      transform 0.3s ease,
      background 0.3s ease;
  }

  &__text {
    position: relative;
    z-index: 1;
    font-size: em(12);
    color: $color-black;
    transition: color 0.3s ease;
  }

  &--on {
    background: yellowgreen;

    .toggle__slider {
      background: $color-accent;
      transform: translateX(em(50));
    }

    .toggle__text:last-child {
      color: white;
    }
  }
}
</style>
