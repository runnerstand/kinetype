<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import axios from 'axios';

// --- Reactive State ---
const textToType = ref("Loading new text...");
const userInput = ref("");
const characters = ref([]);
const gameStatus = ref('ready');
const startTime = ref(0);
const endTime = ref(0);
const errorCount = ref(0);

// --- Game Modes State ---
const gameMode = ref('time');
const timeSetting = ref(60);
const wordSetting = ref(50);
const quoteSetting = ref('medium');
const timer = ref(timeSetting.value);
let timerInterval = null;

// --- NEW: Punctuation and Numbers State ---
const allowPunctuation = ref(false);
const allowNumbers = ref(false);

// --- Score Saving State ---
const playerName = ref("Player");
const scoreSaved = ref(false);

// --- Template Ref for the text area ---
const textAreaRef = ref(null);

// --- Computed Properties ---
const wpm = computed(() => {
    if (gameStatus.value !== 'finished' || !textToType.value) return 0;
    const durationInMinutes = (endTime.value - startTime.value) / 60000;
    const correctChars = userInput.value.length - errorCount.value;
    const wordCount = correctChars / 5;
    if (durationInMinutes === 0) return 0;
    return Math.round(wordCount / durationInMinutes);
});

const accuracy = computed(() => {
    if (gameStatus.value !== 'finished' || !textToType.value) return 100;
    const typedCharsCount = userInput.value.length;
    if (typedCharsCount === 0) return 100;
    const calculatedAccuracy = Math.round(((typedCharsCount - errorCount.value) / typedCharsCount) * 100);
    return Math.max(0, calculatedAccuracy);
});

const typedWordCount = computed(() => {
    return userInput.value.trim().split(/\s+/).filter(word => word.length > 0).length;
});


// --- Functions ---

const setupChallenge = async () => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Load settings from localStorage
    allowPunctuation.value = localStorage.getItem('kinetype-punctuation') === 'true';
    allowNumbers.value = localStorage.getItem('kinetype-numbers') === 'true';

    try {
        let response;
        if (gameMode.value === 'words' || gameMode.value === 'time') {
            // Pass settings as query params to the API
            response = await axios.get(`${import.meta.env.VITE_API_URL}/texts/words?punctuation=${allowPunctuation.value}&numbers=${allowNumbers.value}`);
            const words = response.data;
            let wordCount = gameMode.value === 'time' ? 200 : wordSetting.value;
            const shuffled = words.sort(() => 0.5 - Math.random());
            const selectedWords = shuffled.slice(0, wordCount);
            textToType.value = selectedWords.join(' ');
        } else if (gameMode.value === 'quote') {
            response = await axios.get(`${import.meta.env.VITE_API_URL}/texts/random?category=${quoteSetting.value}`);
            textToType.value = response.data?.content || "No quotes of this length found.";
        }
    } catch (error) {
        console.error("Error fetching new text:", error);
        textToType.value = "Error: Could not fetch a new text.";
    }

    userInput.value = "";
    gameStatus.value = 'ready';
    startTime.value = 0;
    endTime.value = 0;
    errorCount.value = 0;
    timer.value = timeSetting.value;
    scoreSaved.value = false;
    characters.value = textToType.value.split('').map(char => ({ char, status: 'untouched' }));
    if (characters.value.length > 0) {
        characters.value[0].status = 'active';
    }
    if(textAreaRef.value) textAreaRef.value.scrollTop = 0;
};

const startTimer = () => {
    timerInterval = setInterval(() => {
        if (timer.value > 0 && gameStatus.value === 'inprogress') {
            timer.value--;
        } else if (timer.value === 0) {
            gameStatus.value = 'finished';
            endTime.value = Date.now();
            clearInterval(timerInterval);
        }
    }, 1000);
};

const handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.key === 'F5') {
        return;
    }

    if (event.target.classList.contains('name-input')) {
        return;
    }

    if (event.key === 'Tab') {
        event.preventDefault();
        setupChallenge();
        return;
    }

    const isTypingKey = event.key.length === 1;
    const isBackspace = event.key === 'Backspace';

    if (!isTypingKey && !isBackspace) {
        return;
    }
    
    event.preventDefault();
    
    if (gameStatus.value === 'finished' || gameStatus.value === 'paused') {
        return;
    }

    if (gameStatus.value === 'ready' && isTypingKey) {
        gameStatus.value = 'inprogress';
        startTime.value = Date.now();
        if (gameMode.value === 'time') {
            startTimer();
        }
    }

    const typedChar = event.key;
    const currentIndex = userInput.value.length;

    if (isBackspace) {
        if (currentIndex > 0) {
            userInput.value = userInput.value.slice(0, -1);
            characters.value.splice(currentIndex - 1, 1, { ...characters.value[currentIndex - 1], status: 'active' });
            if (characters.value[currentIndex]) {
                characters.value.splice(currentIndex, 1, { ...characters.value[currentIndex], status: 'untouched' });
            }
        }
        return;
    }

    if (isTypingKey && currentIndex < textToType.value.length) {
        let newStatus = 'correct';
        if (typedChar !== characters.value[currentIndex].char) {
            newStatus = 'incorrect';
            errorCount.value++;
        }
        characters.value.splice(currentIndex, 1, { ...characters.value[currentIndex], status: newStatus });

        userInput.value += typedChar;

        if (userInput.value.length === textToType.value.length && gameMode.value !== 'time') {
            gameStatus.value = 'finished';
            endTime.value = Date.now();
            if (timerInterval) clearInterval(timerInterval);
        } else if (userInput.value.length < textToType.value.length) {
             characters.value.splice(currentIndex + 1, 1, { ...characters.value[currentIndex + 1], status: 'active' });
        }

        nextTick(() => {
            const activeCharEl = textAreaRef.value.querySelector('.char.active');
            if (activeCharEl) {
                const container = textAreaRef.value;
                const scrollTarget = activeCharEl.offsetTop - (container.clientHeight / 2) + (activeCharEl.clientHeight / 2);
                container.scrollTop = scrollTarget;
            }
        });
    }
};

const saveScore = async () => {
    if (!playerName.value.trim()) {
        alert("Please enter a name.");
        return;
    }
    try {
        let modeDescription = gameMode.value;
        if (gameMode.value === 'time') modeDescription += ` ${timeSetting.value}`;
        if (gameMode.value === 'words') modeDescription += ` ${wordSetting.value}`;
        if (gameMode.value === 'quote') modeDescription += ` ${quoteSetting.value}`;
        
        const scoreData = {
            playerName: playerName.value,
            wpm: wpm.value,
            accuracy: accuracy.value,
            mode: modeDescription,
            // Include the settings when saving the score
            punctuation: allowPunctuation.value,
            numbers: allowNumbers.value
        };
        await axios.post(`${import.meta.env.VITE_API_URL}/scores/add`, scoreData);
        scoreSaved.value = true;
    } catch (error) {
        console.error("Error saving score:", error);
        alert("Could not save score. Please try again.");
    }
};

const selectTime = (time) => {
    gameMode.value = 'time';
    timeSetting.value = time;
    setupChallenge(); // Add this line
};

const selectWords = (words) => {
    gameMode.value = 'words';
    wordSetting.value = words;
    setupChallenge(); // Add this line
};

const selectQuoteLength = (length) => {
    gameMode.value = 'quote';
    quoteSetting.value = length;
    // Force disable punctuation and numbers for quote mode
    if (allowPunctuation.value || allowNumbers.value) {
        allowPunctuation.value = false;
        allowNumbers.value = false;
        onSettingChange();
    } else {
        setupChallenge();
    }
};

const pauseGame = () => {
    if (gameStatus.value === 'inprogress') {
        gameStatus.value = 'paused';
    }
};

const resumeGame = () => {
    if (gameStatus.value === 'paused') {
        gameStatus.value = 'inprogress';
    }
};

const onSettingChange = () => {
  localStorage.setItem('kinetype-punctuation', allowPunctuation.value);
  localStorage.setItem('kinetype-numbers', allowNumbers.value);
  setupChallenge();
};

const togglePunctuation = () => {
  allowPunctuation.value = !allowPunctuation.value;
  onSettingChange();
};
const toggleNumbers = () => {
  allowNumbers.value = !allowNumbers.value;
  onSettingChange();
};

onMounted(() => {
    setupChallenge();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', pauseGame);
    window.addEventListener('focus', resumeGame);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('blur', pauseGame);
    window.removeEventListener('focus', resumeGame);
    if (timerInterval) clearInterval(timerInterval);
});

</script>

<template>
  <div class="typing-challenge-container">
    <!-- Game Mode Options with Icons -->
    <div class="game-options">
      <div class="option-group">
        <!-- Time mode buttons -->
        <div class="icon-wrapper" data-tooltip="time">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <button @click="selectTime(15)" :class="{active: gameMode === 'time' && timeSetting === 15}" class="option-button">15</button>
        <button @click="selectTime(30)" :class="{active: gameMode === 'time' && timeSetting === 30}" class="option-button">30</button>
        <button @click="selectTime(60)" :class="{active: gameMode === 'time' && timeSetting === 60}" class="option-button">60</button>
        <button @click="selectTime(120)" :class="{active: gameMode === 'time' && timeSetting === 120}" class="option-button">120</button>
      </div>
      <div class="option-group">
        <!-- Words mode buttons -->
        <div class="icon-wrapper" data-tooltip="words">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3M17 12.1H3M10 18.1H3"/></svg>
        </div>
        <button @click="selectWords(10)" :class="{active: gameMode === 'words' && wordSetting === 10}" class="option-button">10</button>
        <button @click="selectWords(25)" :class="{active: gameMode === 'words' && wordSetting === 25}" class="option-button">25</button>
        <button @click="selectWords(50)" :class="{active: gameMode === 'words' && wordSetting === 50}" class="option-button">50</button>
        <button @click="selectWords(100)" :class="{active: gameMode === 'words' && wordSetting === 100}" class="option-button">100</button>
      </div>
      <div class="option-group">
        <!-- Quote mode buttons -->
        <div class="icon-wrapper" data-tooltip="quote">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c.25 0 .25 .25.25 1v1c0 1-.75 2-1.75 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
        </div>
        <button @click="selectQuoteLength('small')" :class="{active: gameMode === 'quote' && quoteSetting === 'small'}" class="option-button">small</button>
        <button @click="selectQuoteLength('medium')" :class="{active: gameMode === 'quote' && quoteSetting === 'medium'}" class="option-button">medium</button>
        <button @click="selectQuoteLength('long')" :class="{active: gameMode === 'quote' && quoteSetting === 'long'}" class="option-button">long</button>
      </div>
      <div class="option-group" v-if="gameMode !== 'quote'">
        <!-- Punctuation and Numbers toggles -->
        <button
          class="option-button"
          :class="{ active: allowPunctuation }"
          @click="togglePunctuation"
          type="button"
          style="display: flex; align-items: center; gap: 0.4rem;"
        >
          <div class="icon-wrapper" data-tooltip="punctuation">
            <!-- SVG for @ (at symbol) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
          </div>
          punctuation
        </button>
        <button
          class="option-button"
          :class="{ active: allowNumbers }"
          @click="toggleNumbers"
          type="button"
          style="display: flex; align-items: center; gap: 0.4rem;"
        >
          <div class="icon-wrapper" data-tooltip="numbers">
            <!-- SVG for # (hash symbol) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>
          </div>
          numbers
        </button>
      </div>
    </div>

    <!-- Word/Time Counter Display -->
    <div v-if="gameMode === 'time' || gameMode === 'words'" class="timer-display">
      <span v-if="gameMode === 'time'">{{ timer }}</span>
      <span v-if="gameMode === 'words'">{{ typedWordCount }} / {{ wordSetting }}</span>
    </div>

    <div class="text-area-wrapper">
        <div v-if="gameStatus === 'paused'" class="pause-overlay">
            <p>Paused</p>
        </div>
        <div class="text-display-area" ref="textAreaRef">
          <span 
            v-for="(item, index) in characters" 
            :key="index"
            :class="['char', item.status]"
          >
            {{ item.char }}
          </span>
        </div>
    </div>

    <div class="retry-button-container">
        <button @click="setupChallenge" class="retry-button" title="Get new text (Tab)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
        </button>
    </div>

    <Transition name="results-fade">
      <div v-if="gameStatus === 'finished'" class="results-area">
        <div class="result-item">
          <span class="result-label">WPM</span>
          <span class="result-value">{{ wpm }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Accuracy</span>
          <span class="result-value">{{ accuracy }}%</span>
        </div>
        
        <div v-if="!scoreSaved" class="save-score-form">
          <input type="text" v-model="playerName" class="name-input" placeholder="Enter your name">
          <div class="icon-wrapper" data-tooltip="Save Score">
            <button @click="saveScore" class="icon-button save-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            </button>
          </div>
        </div>
        <div v-else class="score-saved-message">
          <span>✓ Score Saved!</span>
        </div>

        <div class="icon-wrapper" data-tooltip="Try Again">
          <button @click="setupChallenge" class="icon-button restart-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.typing-challenge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.game-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 2rem;
  color: var(--color-text-secondary);
}

.option-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-wrapper::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 20;
}

.icon-wrapper:hover::after {
  opacity: 1;
  visibility: visible;
}

.option-button {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
  font-family: var(--font-family-main);
  transition: color 0.2s ease;
}

.option-button:hover {
  color: var(--color-text-primary);
}

.option-button.active {
  color: var(--color-accent);
  font-weight: bold;
}

.timer-display {
  font-size: 2rem;
  color: var(--color-accent);
  font-weight: bold;
}

.text-area-wrapper {
    position: relative;
    width: 100%;
}

.pause-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(26, 29, 33, 0.8);
    color: var(--color-text-primary);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    border-radius: 5px;
    z-index: 10;
    cursor: pointer;
}

.text-display-area {
  font-size: 1.75rem;
  letter-spacing: 0.1rem;
  line-height: 3rem; 
  text-align: left;
  color: var(--color-text-secondary);
  cursor: text;
  overflow: hidden;
  max-height: 9rem;
  position: relative;
}


.char {
  transition: color 0.2s ease, background-color 0.2s ease;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}

.char.untouched {
  color: var(--color-text-secondary);
}

.char.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.char.correct {
  color: var(--color-text-primary);
}

.char.incorrect {
  color: #e3342f;
  background-color: rgba(227, 52, 47, 0.15);
}

.retry-button-container {
    margin-top: -1rem;
    margin-bottom: -1rem;
}

.retry-button {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: color 0.2s ease, transform 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.retry-button svg {
    width: 20px;
    height: 20px;
}

.retry-button:hover {
    color: var(--color-accent);
    transform: rotate(360deg);
}


.results-area {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  justify-content: center;
}

.result-item {
  text-align: center;
}

.result-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.result-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-accent);
  display: block;
}

.save-score-form {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.name-input {
  background-color: var(--color-surface);
  border: 1px solid var(--color-text-secondary);
  color: var(--color-text-primary);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-family: var(--font-family-main);
  font-size: 1rem;
}

.icon-button {
  background-color: var(--color-accent);
  color: var(--color-bg);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: var(--color-accent-hover);
}

.score-saved-message {
  color: var(--color-accent);
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-fade-enter-active {
  transition: all 0.4s ease-out;
}

.results-fade-leave-active {
  transition: all 0.3s ease-in;
}

.results-fade-enter-from,
.results-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .game-options {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .text-display-area {
    font-size: 1.5rem;
    line-height: 2.2rem;
    max-height: 6.6rem; /* 3 lines */
  }

  .results-area {
    gap: 1.5rem;
  }

  .result-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .option-group {
    gap: 0.5rem;
  }
  .option-button {
    font-size: 0.9rem;
  }
  .text-display-area {
    font-size: 1.2rem;
    line-height: 1.8rem;
    max-height: 5.4rem; /* 3 lines */
  }
}
</style>
