// This file defines the "blueprint" for our score data.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  // --- NEW: Fields to track test configuration ---
  punctuation: {
    type: Boolean,
    default: false
  },
  numbers: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true,
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
