const router = require('express').Router();
let Text = require('../models/text.model');

// --- UPDATED: GET A LIST OF WORDS FROM THE DATABASE ---
router.route('/words').get(async (req, res) => {
  try {
    const { punctuation, numbers } = req.query;

    // Start with a base filter for regular words
    const filter = { category: 'word' };
    
    // Build an array of categories to fetch
    const categories = ['word'];
    if (punctuation === 'true') {
      categories.push('punctuation');
    }
    if (numbers === 'true') {
      categories.push('number');
    }

    // Find all texts that match any of the selected categories
    const texts = await Text.find({ category: { $in: categories } });
    
    const wordList = texts.map(text => text.content);
    res.json(wordList);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// ... rest of the file remains the same ...

// --- GET ALL TEXTS ---
router.route('/').get((req, res) => {
  Text.find()
    .then(texts => res.json(texts))
    .catch(err => res.status(400).json('Error: ' + err));
});

// --- GET A RANDOM TEXT (for Quote/Time Mode) ---
router.route('/random').get(async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : { category: { $in: ['quote', 'small', 'medium', 'long'] } };
    const count = await Text.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json('No texts found for the specified criteria.');
    }
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
  const newText = new Text({ content, category });
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

module.exports = router;
