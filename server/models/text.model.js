// This file defines the "blueprint" for our race text data.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const textSchema = new Schema({
  // 'content' will store the actual paragraph or list of words to be typed.
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1 // Ensure content is not empty
  },
  language: {
    type: String,
    required: true,
    trim: true,
    default: 'en'
  },
  // 'category' helps us organize our texts.
  category: {
    type: String,
    required: true,
    trim: true,
    // 'enum' ensures that the category can only be one of these values.
    enum: ['quote', 'word', 'punctuation', 'number', 'small', 'medium', 'long']
  }
}, {
  timestamps: true,
});

// Compile the schema into a model.
const Text = mongoose.model('Text', textSchema);

// Export the model to be used in other files.
module.exports = Text;
