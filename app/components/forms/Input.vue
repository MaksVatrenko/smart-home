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
  gap: em(4);

  &__label {
    display: block;
    font-weight: bold;
    color: darkgrey;
  }

  &__field {
    width: 100%;
    padding: em(5) em(10);
    color: black;
    background-color: white;
    border: 1px solid grey;
    border-radius: em(10);
    transition: border-color 0.3s;

    &::placeholder {
      color: grey;
    }

    &:focus {
      outline: none;
      border-color: blue;
    }
  }
}
</style>
