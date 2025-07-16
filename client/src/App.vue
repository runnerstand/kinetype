<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'; // Import the onMounted hook

// This function applies the theme class to the main body element.
const applyTheme = (themeName) => {
  document.body.className = themeName;
};

// When the main App component first loads (on any page),
// check localStorage for a saved theme and apply it.
onMounted(() => {
  const savedTheme = localStorage.getItem('kinetype-theme') || ''; // Default to the base theme
  applyTheme(savedTheme);
});
</script>

<template>
  <!-- This is the main layout for our entire application -->
  <div class="app-container">
    
    <!-- Header Section -->
    <header class="app-header">
      <div class="logo">
        <h1>Kinetype</h1>
      </div>
      <nav class="main-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
      </nav>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>

  </div>
</template>

<style>
/* We will move most styles to a separate file, but some base styles can live here */
#app {
  height: 100%;
}
</style>
