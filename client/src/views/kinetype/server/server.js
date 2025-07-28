// Import
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const textsRouter = require('./routes/texts')
const scoresRouter = require('./routes/scores');
require('dotenv').config()
    
// App configuration
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use('/texts', textsRouter);
app.use('/scores', scoresRouter);

// Database connection
const uri = process.env.MONGO_URI
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log(err))

//Api routes
app.get('/', (req, res) => {
    res.send('The API is running!')
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})