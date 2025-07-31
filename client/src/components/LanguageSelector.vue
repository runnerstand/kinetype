<template>
  <div class="language-selector" ref="selectorRef">
    <button @click="toggleDropdown" class="selector-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      <span>{{ selectedLanguage }}</span>
    </button>
    <transition name="dropdown-fade">
      <div v-if="isOpen" class="dropdown-menu">
        <ul>
          <li 
            v-for="lang in languages" 
            :key="lang.code" 
            @click="selectLanguage(lang.code)"
            :class="{ active: lang.code === selectedLanguage }"
          >
            {{ lang.name }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  selectedLanguage: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['language-selected']);

const isOpen = ref(false);
const selectorRef = ref(null);

const languages = ref([
  { code: 'en', name: 'English' },
  { code: 'vn', name: 'Vietnamese' },
  { code: 'es', name: 'Español' },
  // Add more languages here in the future
]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectLanguage = (langCode) => {
  emit('language-selected', langCode);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (selectorRef.value && !selectorRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.selector-button {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-family-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.selector-button:hover {
  color: var(--color-text-primary);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  background-color: var(--color-surface);
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  width: 150px;
  overflow: hidden;
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.dropdown-menu li {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover {
  background-color: var(--color-accent-hover-light);
}

.dropdown-menu li.active {
  color: var(--color-accent);
  font-weight: bold;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) translateX(-50%);
}
</style>
