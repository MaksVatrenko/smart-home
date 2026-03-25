<template>
  <div class="test">testModal</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.test {
  display: flex;
  align-items: center;
  justify-content: center;
  width: em(400);
  height: em(400);
  color: black;
  background: #f8c4c4;

  @media (max-width: $mobile) {
    width: em(200);
    height: em(200);
  }
}
</style>
