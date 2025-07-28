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
    const response = await axios.get('http://localhost:5000/scores');
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

    <!-- Show a loading message while fetching data -->
    <div v-if="isLoading" class="loading-message">Loading scores...</div>

    <!-- Show an error message if the API call fails -->
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Display the leaderboard table if data is loaded successfully -->
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
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Show a message if there are no scores to display -->
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
  color: var(--color-accent);
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
}

.scores-table {
  width: 100%;
  border-collapse: collapse;
}

.scores-table th, .scores-table td {
  padding: 0.75rem 1rem;
  text-align: left;
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
</style>
