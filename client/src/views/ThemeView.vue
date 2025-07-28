<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('');

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
  <div class="theme-container">
    <h1 class="title">Theme</h1>
    <div class="theme-options">
      <button @click="setTheme('')" :class="{ active: currentTheme === '' }" class="theme-button">Fabrik</button>
      <button @click="setTheme('theme-light')" :class="{ active: currentTheme === 'theme-light' }" class="theme-button">Blue Alert</button>
      <button @click="setTheme('theme-red-samurai')" :class="{ active: currentTheme === 'theme-red-samurai' }" class="theme-button">Red Samurai</button>
      <button @click="setTheme('theme-warm-dark')" :class="{ active: currentTheme === 'theme-warm-dark' }" class="theme-button">Black Gold</button>
      <button @click="setTheme('theme-synthwave')" :class="{ active: currentTheme === 'theme-synthwave' }" class="theme-button">Synthwave</button>
      <button @click="setTheme('theme-halflife')" :class="{ active: currentTheme === 'theme-halflife' }" class="theme-button">Half-Life</button>
      <button @click="setTheme('theme-oblivion')" :class="{ active: currentTheme === 'theme-oblivion' }" class="theme-button">Oblivion</button>
      <button @click="setTheme('theme-ocean')" :class="{ active: currentTheme === 'theme-ocean' }" class="theme-button">Ocean</button>
      <button @click="setTheme('theme-mecha01')" :class="{ active: currentTheme === 'theme-mecha01' }" class="theme-button">Mecha-01</button>
      <button @click="setTheme('theme-dmg')" :class="{ active: currentTheme === 'theme-dmg' }" class="theme-button">DMG</button>
      <button @click="setTheme('theme-rainyday')" :class="{ active: currentTheme === 'theme-rainyday' }" class="theme-button">Rainy Day</button>
      <button @click="setTheme('theme-wild')" :class="{ active: currentTheme === 'theme-wild' }" class="theme-button">Wild</button>
      <button @click="setTheme('theme-british-racing')" :class="{ active: currentTheme === 'theme-british-racing' }" class="theme-button">British Racing</button>
      <button @click="setTheme('theme-poco')" :class="{ active: currentTheme === 'theme-poco' }" class="theme-button">Poco</button>
    </div>
  </div>
</template>

<style scoped>
.theme-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  background: var(--color-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  text-align: center;
}

.theme-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.theme-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
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
</style>
