<script setup>
// Import our new component so we can use it in the template.
import TypingChallenge from '../components/TypingChallenge.vue';
</script>

<template>
  <!-- This is the main content for our Home page. -->
  <!-- We are simply displaying the TypingChallenge component here. -->
  <div class="home-view">
    <TypingChallenge />
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 2rem; /* Add some space from the header */
}
</style>
