<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Create a reactive variable to hold our array of scores.
const scores = ref([]);
// Create a state for loading to give user feedback.
const isLoading = ref(true);
// Create a state for errors.
const error = ref(null);

// --- NEW: Filter State ---
const filters = ref({
  language: 'all',
  mode: 'all',
  timeline: 'all'
});

// This function will fetch the scores from our back-end API.
const fetchScores = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const params = {
      language: filters.value.language,
      mode: filters.value.mode,
      timeline: filters.value.timeline
    };
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores`);
    // The backend now handles sorting, so we can remove it from the frontend.
    scores.value = response.data;
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

    <div class="filters-container">
      <div class="filter-group">
        <label for="language-filter">Language</label>
        <select id="language-filter" v-model="filters.language" @change="fetchScores">
          <option value="all">All</option>
          <option value="en">English</option>
          <option value="vn">Vietnamese</option>
          <option value="es">Español</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="mode-filter">Mode</label>
        <select id="mode-filter" v-model="filters.mode" @change="fetchScores">
          <option value="all">All</option>
          <option value="time">Time</option>
          <option value="words">Words</option>
          <option value="quote">Quote</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="timeline-filter">Timeline</label>
        <select id="timeline-filter" v-model="filters.timeline" @change="fetchScores">
          <option value="all">All Time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>

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
            <th>Mods</th>
            <th>Language</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(score, index) in scores" :key="score._id">
            <td>{{ index + 1 }}</td>
            <td>{{ score.playerName }}</td>
            <td>{{ score.wpm }}</td>
            <td>{{ score.accuracy }}%</td>
            <td>{{ score.mode }}</td>
            <td>
              <div class="mods-pills">
                <div :class="['mods-pill', score.punctuation ? 'enabled' : 'disabled']" title="Punctuation">@</div>
                <div :class="['mods-pill', score.numbers ? 'enabled' : 'disabled']" title="Numbers">#</div>
              </div>
            </td>
            <td>{{ score.language }}</td>
            <td>{{ new Date(score.createdAt).toLocaleDateString() }}</td>
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
  margin-bottom: 1rem;
  text-align: center;
}

.filters-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.filter-group select {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-text-secondary);
  border-radius: 5px;
  padding: 0.5rem;
  font-family: var(--font-family-main);
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
