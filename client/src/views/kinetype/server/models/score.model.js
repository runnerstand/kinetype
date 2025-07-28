// This file defines the "blueprint" for our score data.

const mongoose = require('mongoose');

// A Mongoose Schema defines the structure of the document,
// default values, validators, etc.
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  // 'playerName' will be a string, and it's required.
  playerName: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends of a string.
    minlength: 2  // Must be at least 2 characters long.
  },
  // 'wpm' (words per minute) will be a number, and it's required.
  wpm: {
    type: Number,
    required: true
  },
  // 'accuracy' will be a number, and it's required.
  accuracy: {
    type: Number,
    required: true
  },
  // 'mode' will store which game mode was played (e.g., 'timed', 'quote').
  mode: {
    type: String,
    required: true
  }
}, {
  // 'timestamps' automatically adds 'createdAt' and 'updatedAt' fields.
  timestamps: true,
});

// We then compile our schema into a Model. A model is a class with which
// we construct documents. In this case, each document will be a score
// with the properties we declared in our schema.
const Score = mongoose.model('Score', scoreSchema);

// Finally, we export the model so we can use it in other parts of our server.
module.exports = Score;
