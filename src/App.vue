<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import Countdown from './components/Countdown.vue';
</script>

<template>
  <Countdown msg="距离2025年新年" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
