<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Create a reactive variable to hold our array of scores.
const scores = ref([]);
// Create a state for loading to give user feedback.
const isLoading = ref(true);
// Create a state for errors.
const error = ref(null);

// This function will fetch the scores from our back-end API.
const fetchScores = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await axios.get('${import.meta.env.VITE_API_URL}/scores');
    // Sort scores by WPM in descending order before storing them.
    scores.value = response.data.sort((a, b) => b.wpm - a.wpm);
  } catch (err) {
    console.error("Error fetching scores:", err);
    error.value = "Failed to load leaderboard. Please try again.";
  } finally {
    // This will run whether the request succeeded or failed.
    isLoading.value = false;
  }
};

// onMounted is a lifecycle hook that runs when the component is first loaded.
// It's the perfect place to fetch our initial data.
onMounted(() => {
  fetchScores();
});
</script>

<template>
  <div class="leaderboard-container">
    <h1 class="title">Leaderboard</h1>

    <div v-if="isLoading" class="loading-message">Loading scores...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="!isLoading && !error && scores.length > 0" class="scores-table-wrapper">
      <table class="scores-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>WPM</th>
            <th>Accuracy</th>
            <th>Mode</th>
            <th>Date</th>
            <th>Mods</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(score, index) in scores" :key="score._id">
            <td>{{ index + 1 }}</td>
            <td>{{ score.playerName }}</td>
            <td>{{ score.wpm }}</td>
            <td>{{ score.accuracy }}%</td>
            <td>{{ score.mode }}</td>
            <td>{{ new Date(score.createdAt).toLocaleDateString() }}</td>
            <td>
              <!-- UPDATED: mods pills with conditional styling -->
              <div class="mods-pills">
                <div :class="['mods-pill', score.punctuation ? 'enabled' : 'disabled']">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                </div>
                <div :class="['mods-pill', score.numbers ? 'enabled' : 'disabled']">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16"/><path d="M4 14h16"/><path d="M10 4l-2 16"/><path d="M16 4l-2 16"/></svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="!isLoading && !error && scores.length === 0" class="no-scores-message">
      No scores have been saved yet. Be the first!
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
  width: 100%;
  max-width: 1000px;
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

.loading-message, .error-message, .no-scores-message {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-top: 3rem;
}

.error-message {
  color: #e3342f;
}

.scores-table-wrapper {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto; /* Allow horizontal scrolling on small screens */
}

.scores-table {
  width: 100%;
  border-collapse: collapse;
}

.scores-table th, .scores-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  white-space: nowrap;
}

.scores-table thead {
  border-bottom: 2px solid var(--color-accent);
}

.scores-table th {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.scores-table tbody tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.1);
}

.scores-table td {
  color: var(--color-text-primary);
}

.mods-pills {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

/* --- NEW: mods Pill Styles --- */
.mods-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.8rem;
    border-radius: 9999px; /* This creates the pill shape */
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

.mods-pill.enabled {
    background: var(--color-accent);
    color: var(--color-accent-text);
}

.mods-pill.disabled {
    background-color: var(--color-bg);
    color: var(--color-text-secondary);
    opacity: 0.6;
}
</style>
