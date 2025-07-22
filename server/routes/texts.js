const router = require('express').Router();
let Text = require('../models/text.model');

// --- GET ALL TEXTS ---
router.route('/').get((req, res) => {
  Text.find()
    .then(texts => res.json(texts))
    .catch(err => res.status(400).json('Error: ' + err));
});


// --- GET A LIST OF WORDS FROM THE DATABASE ---
router.route('/words').get((req, res) => {
  Text.find({ category: 'word' })
    .then(texts => {
      const wordList = texts.map(text => text.content);
      res.json(wordList);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


// --- UPDATED: GET A RANDOM TEXT (for Quote/Time Mode) ---
router.route('/random').get(async (req, res) => {
  try {
    // Get the category from the query string (e.g., ?category=small)
    const { category } = req.query;

    // If a specific category (small, medium, long) is provided, use it as a filter.
    // Otherwise, find any document that is NOT a single 'word'.
    const filter = category ? { category } : { category: { $ne: 'word' } };

    const count = await Text.countDocuments(filter);

    if (count === 0) {
      return res.status(404).json('No texts found for the specified criteria.');
    }

    // Fetch a random document based on the filter.
    const random = Math.floor(Math.random() * count);
    const text = await Text.findOne(filter).skip(random);
    res.json(text);

  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// --- ADD NEW TEXT (CREATE) ---
router.route('/add').post((req, res) => {
  const content = req.body.content;
  const category = req.body.category;

  const newText = new Text({
    content,
    category,
  });

  newText.save()
    .then(() => res.json('Text added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// --- BULK ADD MULTIPLE TEXTS ---
router.route('/add-many').post((req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json('Error: Request body must be an array.');
  }

  Text.insertMany(req.body)
    .then(texts => res.json(`${texts.length} texts added successfully!`))
    .catch(err => res.status(400).json('Error: ' + err));
});

// In your frontend code (e.g., src/api/texts.js or wherever you fetch)
const apiBase = import.meta.env.VITE_API_URL.replace(/\/$/, ''); // Remove trailing slash
const response = await fetch(`${apiBase}/texts/words`); // Correct single slash


module.exports = router;
