<script setup>
import { ref, onMounted } from 'vue';

// A reactive variable to keep track of the currently selected theme.
const currentTheme = ref('');

// This function will be called when a theme button is clicked.
const setTheme = (themeName) => {
  // FIX: Apply the class to the <body> element for more robust styling.
  document.body.className = themeName;
  
  // Save the user's preference in localStorage so it persists.
  localStorage.setItem('kinetype-theme', themeName);

  // Update our local state to highlight the active button.
  currentTheme.value = themeName;
};

// When the component first loads, check if a theme was saved previously.
onMounted(() => {
  const savedTheme = localStorage.getItem('kinetype-theme') || ''; // Default to '' (our body styles)
  setTheme(savedTheme);
});
</script>

<template>
  <div class="settings-container">
    <h1 class="title">Settings</h1>

    <div class="setting-section">
      <h2 class="section-title">Theme</h2>
      <p class="section-description">Choose a color theme for the application.</p>
      <div class="theme-options">
        <!-- The @click directive calls our setTheme function. -->
        <!-- The :class binding adds an 'active' class to the selected button. -->
        <button @click="setTheme('')" :class="{ active: currentTheme === '' }" class="theme-button slate-sky">Slate & Sky</button>
        <button @click="setTheme('theme-light')" :class="{ active: currentTheme === 'theme-light' }" class="theme-button paper-ink">Paper & Ink</button>
        <button @click="setTheme('theme-warm-dark')" :class="{ active: currentTheme === 'theme-warm-dark' }" class="theme-button midnight-amber">Midnight & Amber</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.settings-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-accent);
  margin-bottom: 2rem;
}

.setting-section {
  background-color: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.theme-options {
  display: flex;
  gap: 1rem;
}

.theme-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-text-secondary);
  background-color: transparent;
  color: var(--color-text-primary);
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
}

.theme-button:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.theme-button.active {
  border-color: var(--color-accent);
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* Example styles for the buttons to show their theme colors */
.theme-button.slate-sky {
  border-color: #3891A6;
}
.theme-button.paper-ink {
  border-color: #004E89;
}
.theme-button.midnight-amber {
  border-color: #FFBF00;
}
</style>
