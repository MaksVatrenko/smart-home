<template>
  <div
    ref="modalWrapper"
    class="modal"
    :class="{
      'modal--active': modal.isModalActive
    }"
  >
    <transition name="modal-fade">
      <div v-if="modal.isAnimated" ref="overlay" class="modal__overlay"></div>
    </transition>

    <transition name="modal-content" @after-leave="messagesStore.closeModal">
      <div v-if="modal.isAnimated" ref="content" class="modal__content">
        <button
          class="modal__close"
          type="button"
          @click="messagesStore.finishModalAnimation()"
        >
          <Icon class="modal__icon" name="gridicons:cross" />
        </button>

        <component
          :is="modalComponents[modal.componentName]"
          class="modal__component"
          :modal-data="modal.modalData"
          @close-modal="messagesStore.finishModalAnimation()"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useMessagesStore } from '@/stores/messages'
import { storeToRefs } from 'pinia'

const modalFiles = import.meta.glob('@/components/modals/*.vue')

const messagesStore = useMessagesStore()
const { modal } = storeToRefs(messagesStore)

const modalComponents = Object.fromEntries(
  Object.entries(modalFiles).map(([path, importFunc]) => {
    const name = path.split('/').pop()?.replace('.vue', '') || ''

    return [name, defineAsyncComponent(importFunc as () => Promise<any>)]
  })
)

const overlay = ref(null)
const content = ref(null)
const modalWrapper = ref(null)
</script>

<style scoped lang="scss">
.modal {
  $self: &;

  &--active {
    z-index: 1000;
  }

  &__overlay {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgb(12 12 13 / 70%);
    backdrop-filter: blur(4px);
  }

  &__content {
    position: absolute;
    z-index: 2;
    height: auto;
    overflow: hidden;
    border: em(1) solid rgba(90, 51, 255, 0.42);
    border-radius: em(14);
    width: 80%;
    box-shadow:
      0 -7.7px 18px 0 rgba(0, 45, 78, 0.21),
      0 -7.7px 18px 0 rgba(0, 17, 41, 0.2),
      41px -16px 108px 0 rgba(50, 97, 255, 0.51),
      -55.72px -10px 101.07px 0 rgba(90, 51, 255, 0.42);
  }

  &__close {
    position: absolute;
    top: em(5);
    right: em(5);
    z-index: 100;
    width: em(20);
    height: em(20);
    background: transparent;
  }

  &__icon {
    width: 100%;
    height: 100%;
  }

  &__icon-mobile {
    display: none;

    @media (max-width: $mobile) {
      display: block;
      width: em(40);
      height: em(40);
    }
  }

  &__component {
    max-height: 90vh;
    overflow: scroll;
    transition: 250ms;

    &--loading {
      opacity: 0;
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0);
}

.modal-content-enter-to,
.modal-content-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
