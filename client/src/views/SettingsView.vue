<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('');
const allowPunctuation = ref(false);
const allowNumbers = ref(false);

const setTheme = (themeName) => {
  document.body.className = themeName;
  localStorage.setItem('kinetype-theme', themeName);
  currentTheme.value = themeName;
};

onMounted(() => {
  const savedTheme = localStorage.getItem('kinetype-theme') || '';
  setTheme(savedTheme);
});
</script>

<template>
  <div class="settings-container">
    <h1 class="title">Settings</h1>

    <div class="settings-group">
      <div class="setting-section">
        <h2 class="section-title">Theme</h2>
        <p class="section-description">Choose a color theme for the application.</p>
        <div class="theme-options">
          <button @click="setTheme('')" :class="{ active: currentTheme === '' }" class="theme-button">Fabrik</button>
          <button @click="setTheme('theme-light')" :class="{ active: currentTheme === 'theme-light' }" class="theme-button">Blue Alert</button>
          <button @click="setTheme('theme-warm-dark')" :class="{ active: currentTheme === 'theme-warm-dark' }" class="theme-button">Black Gold</button>
          <button @click="setTheme('theme-synthwave')" :class="{ active: currentTheme === 'theme-synthwave' }" class="theme-button">Synthwave</button>
          <button @click="setTheme('theme-halflife')" :class="{ active: currentTheme === 'theme-halflife' }" class="theme-button">Half-Life</button>
          <button @click="setTheme('theme-ocean')" :class="{ active: currentTheme === 'theme-ocean' }" class="theme-button">Ocean</button>
          <button @click="setTheme('theme-mecha01')" :class="{ active: currentTheme === 'theme-mecha01' }" class="theme-button">Mecha-01</button>
          <button @click="setTheme('theme-dmg')" :class="{ active: currentTheme === 'theme-dmg' }" class="theme-button">DMG</button>
          <button @click="setTheme('theme-rainyday')" :class="{ active: currentTheme === 'theme-rainyday' }" class="theme-button">Rainy Day</button>
          <button @click="setTheme('theme-wild')" :class="{ active: currentTheme === 'theme-wild' }" class="theme-button">Wild</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  width: 100%;
  max-width: 900px; /* was 650px, now wider */
  margin: 0 auto;
  padding: 1rem;
}

/* Group both sections together visually */
.settings-group {
  background-color: var(--color-surface);
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  background: var(--color-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
}

.setting-section {
  background: none;
  padding: 0;
  border-radius: 0;
  margin: 0;
  box-shadow: none;
  transition: none;
}

.setting-section + .setting-section {
  margin-top: 1.5rem; /* space between theme and options */
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
}

.theme-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

/* --- UPDATED BUTTON STYLES --- */
.theme-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent; /* Start with a transparent border */
  background-color: var(--color-bg); /* Use the main background color */
  color: var(--color-text-secondary); /* Muted text color */
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
}

.theme-button:hover {
  border-color: var(--color-accent);
  color: var(--color-text-primary);
}

.theme-button.active {
  background: var(--color-accent);
  color: var(--color-accent-text);
  border-color: var(--color-accent);
}

.option-toggle-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.option-label {
  min-width: 120px;
  font-family: 'Fira Mono', 'Consolas', monospace;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  letter-spacing: 0.02em;
}

.option-toggle-group {
  display: flex;
  gap: 0.5rem;
}

.option-toggle {
  padding: 0.4rem 1.2rem;
  border: none;
  border-radius: 6px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-weight: 500;
}

.option-toggle.active {
  background: var(--color-accent);
  color: var(--color-accent-text);
}

.option-toggle:not(.active):hover {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
