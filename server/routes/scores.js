// This file will contain all the API endpoints for handling scores.

const router = require('express').Router();
// We need to import our Score model so we can interact with the database.
let Score = require('../models/score.model');

// -----------------------------------------------------------------------------
//  1. GET ALL SCORES (READ)
// -----------------------------------------------------------------------------
// This handles GET requests to the /scores/ URL.
router.route('/').get(async (req, res) => {
  try {
    const { language, mode, timeline } = req.query;
    const filter = {};

    if (language && language !== 'all') {
      filter.language = language;
    }

    if (mode && mode !== 'all') {
      // Use a regex to match modes like "time 15", "time 30", etc.
      filter.mode = new RegExp(`^${mode}`, 'i');
    }

    if (timeline && timeline !== 'all') {
      const now = new Date();
      let startDate;
      switch (timeline) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'monthly':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }
      if (startDate) {
        filter.createdAt = { $gte: startDate };
      }
    }

    const scores = await Score.find(filter).sort({ wpm: -1, accuracy: -1 }).limit(100);
    res.json(scores);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// -----------------------------------------------------------------------------
//  2. ADD NEW SCORE (CREATE)
// -----------------------------------------------------------------------------
// This handles POST requests to the /scores/add URL.
router.route('/add').post((req, res) => {
  const { playerName, wpm, accuracy, mode, punctuation, numbers, language } = req.body;

  // --- Server-side Validation ---
  const MIN_WPM_THRESHOLD = 10;
  const MIN_ACCURACY_THRESHOLD = 50;
  const MAX_WPM_THRESHOLD = 300;

  if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
    return res.status(400).json('Error: Player name is required.');
  }
  if (wpm === undefined || typeof wpm !== 'number' || wpm < MIN_WPM_THRESHOLD || wpm > MAX_WPM_THRESHOLD) {
    return res.status(400).json(`Error: WPM must be between ${MIN_WPM_THRESHOLD} and ${MAX_WPM_THRESHOLD}.`);
  }
  if (accuracy === undefined || typeof accuracy !== 'number' || accuracy < MIN_ACCURACY_THRESHOLD || accuracy > 100) {
    return res.status(400).json(`Error: Accuracy must be at least ${MIN_ACCURACY_THRESHOLD}%.`);
  }

  const newScore = new Score({
    playerName: playerName.trim(),
    wpm,
    accuracy,
    mode,
    punctuation,
    numbers,
    language,
  });

  newScore.save()
    .then(() => res.json('Score added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// We export the router so we can use it in our main server.js file.
module.exports = router;
