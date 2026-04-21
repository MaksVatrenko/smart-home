<template>
  <button
    type="button"
    class="toggle"
    :class="{
      'toggle--on': model,
      'toggle--disabled': disabled
    }"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="toggle__slider" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const model = defineModel({
  type: Boolean,
  default: false
})

function toggle() {
  if (props.disabled) return

  model.value = !model.value
  emit('change', model.value)
}
</script>

<style scoped lang="scss">
.toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: em(50);
  height: em(30);
  padding: em(3);
  cursor: pointer;
  background: rgba(35, 37, 50, 1);
  border: none;
  border-radius: em(30);
  transition: background 0.25s ease;

  &__slider {
    width: em(24);
    height: em(24);
    background: linear-gradient(to right, #354269, #3b3163);
    border-radius: 50%;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    transform: translateX(0);
    transition: transform 0.25s ease;
  }

  &--on {
    .toggle__slider {
      background: linear-gradient(to right, #3161fe, #5a31fe);
      transform: translateX(em(20));
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
