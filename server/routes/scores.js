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
  // The data for the new score will be in the request body (req.body).
  const playerName = req.body.playerName;
  const wpm = Number(req.body.wpm);
  const accuracy = Number(req.body.accuracy);
  const mode = req.body.mode;
  const punctuation = req.body.punctuation;
  const numbers = req.body.numbers;
  const language = req.body.language;

  // We create a new Score instance using the data from the request body.
  const newScore = new Score({
    playerName,
    wpm,
    accuracy,
    mode,
    punctuation,
    numbers,
    language,
  });

  // .save() is a Mongoose method that saves the new document to the database.
  // It also returns a promise.
  newScore.save()
    .then(() => res.json('Score added!')) // If successful, return a success message.
    .catch(err => res.status(400).json('Error: ' + err)); // If there's an error, return a 400 error.
});

// We export the router so we can use it in our main server.js file.
module.exports = router;
