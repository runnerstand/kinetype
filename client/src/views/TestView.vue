<script setup>
import { ref } from 'vue';
import axios from 'axios';

// A reactive variable to store and display the JSON response from the server.
const apiResponse = ref(null);
const isLoading = ref(false);

// Function to fetch all scores from the API.
const getAllScores = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores`);
    apiResponse.value = response.data;
  } catch (error) {
    apiResponse.value = { error: 'Failed to fetch scores', details: error.message };
  } finally {
    isLoading.value = false;
  }
};

// Function to fetch all texts from the API.
const getAllTexts = async () => {
  isLoading.value = true;
  try {
    // Note: We don't have a GET all texts route yet, we will add it.
    // For now, this will call the random endpoint.
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/texts/random`);
    apiResponse.value = response.data;
  } catch (error) {
    apiResponse.value = { error: 'Failed to fetch texts', details: error.message };
  } finally {
    isLoading.value = false;
  }
};

// Function to add a new test score.
const addTestScore = async () => {
  isLoading.value = true;
  const testScore = {
    playerName: "Test Player",
    wpm: 99,
    accuracy: 99,
    mode: "test"
  };
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/scores/add`, testScore);
    apiResponse.value = response.data;
  } catch (error) {
    apiResponse.value = { error: 'Failed to add score', details: error.message };
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="test-container">
    <h1 class="title">API Test Page</h1>
    <p class="description">
      This page is used to directly test the back-end API endpoints to demonstrate CRUD functionality.
    </p>

    <div class="test-buttons">
      <button @click="getAllScores">GET All Scores</button>
      <button @click="getAllTexts">GET Random Text</button>
      <button @click="addTestScore">POST New Score</button>
    </div>

    <div class="response-area">
      <h2 class="response-title">API Response:</h2>
      <div v-if="isLoading" class="loading-message">Loading...</div>
      <!-- The <pre> tag is perfect for displaying formatted JSON -->
      <pre v-else>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.test-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  color: var(--color-text-primary);
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.description {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.test-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.test-buttons button {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-accent);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-buttons button:hover {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

.response-area {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 200px;
}

.response-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.loading-message {
  color: var(--color-text-secondary);
}

pre {
  white-space: pre-wrap; /* Allows the text to wrap */
  word-wrap: break-word; /* Breaks long words */
  color: #a7e22e; /* A nice green for JSON output */
  background-color: #23241f; /* A dark background for contrast */
  padding: 1rem;
  border-radius: 5px;
}
</style>
