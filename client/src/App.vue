<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';

// This function applies the theme class to the main body element.
const applyTheme = (themeName) => {
  document.body.className = themeName;
};

// When the main App component first loads, check localStorage for a saved theme.
onMounted(() => {
  const savedTheme = localStorage.getItem('kinetype-theme') || '';
  applyTheme(savedTheme);
});
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">
        <h1>Kinetype</h1>
      </div>
      <nav class="main-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <RouterLink to="/theme">Theme</RouterLink>
        <a href="https://github.com/runnerstand/kinetype" target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  height: 100%;
}
</style>
