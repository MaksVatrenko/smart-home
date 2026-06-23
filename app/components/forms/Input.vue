<template>
  <div class="input">
    <label v-if="label" :for="id" class="input__label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      class="input__field"
      :value="modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped lang="scss">
.input {
  display: flex;
  flex-direction: column;
  gap: em(6);

  &__label {
    display: block;
    font-size: em(13);
    font-weight: 600;
    color: $color-text-secondary;
  }

  &__field {
    width: 100%;
    padding: em(12) em(14);
    font-size: em(14);
    color: $color-text;
    background-color: $color-bg;
    border: 1px solid rgba($color-text, 0.12);
    border-radius: em(10);
    transition: border-color 0.2s;

    &::placeholder {
      color: $color-text-secondary;
      opacity: 0.6;
    }

    &:focus {
      outline: none;
      border-color: rgba(91, 107, 255, 0.7);
    }
  }
}
</style>
