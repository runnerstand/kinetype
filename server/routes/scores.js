// This file will contain all the API endpoints for handling scores.

const router = require('express').Router();
// We need to import our Score model so we can interact with the database.
let Score = require('../models/score.model');

// -----------------------------------------------------------------------------
//  1. GET ALL SCORES (READ)
// -----------------------------------------------------------------------------
// This handles GET requests to the /scores/ URL.
router.route('/').get((req, res) => {
  Score.find()
    .then(scores => res.json(scores))
    .catch(err => res.status(400).json('Error: ' + err));
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

  // We create a new Score instance using the data from the request body.
  const newScore = new Score({
    playerName,
    wpm,
    accuracy,
    mode,
    punctuation,
    numbers,
  });

  // .save() is a Mongoose method that saves the new document to the database.
  // It also returns a promise.
  newScore.save()
    .then(() => res.json('Score added!')) // If successful, return a success message.
    .catch(err => res.status(400).json('Error: ' + err)); // If there's an error, return a 400 error.
});

// We export the router so we can use it in our main server.js file.
module.exports = router;
