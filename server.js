const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
app.use(cors({
    origin: 'https://mialyn.saraban.in'  // Replace with your frontend domain
}));
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://mongodbsaraban:thiru736@saraban.sn7wk.mongodb.net/?retryWrites=true&w=majority&appName=saraban'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Review Schema
const reviewSchema = new mongoose.Schema({
    star: { type: Number, required: true },
    reviewText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create Review model
const Review = mongoose.model('Review', reviewSchema);

// POST route to submit a review
app.post('/api/reviews', async (req, res) => {
    const { star, reviewText } = req.body;
    if (!star || !reviewText) {
        return res.status(400).json({ message: 'Star rating and review text are required.' });
    }

    const newReview = new Review({ star, reviewText });
    try {
        await newReview.save();
        res.status(201).json({ message: 'Review submitted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting review.' });
    }
});

// GET route to fetch all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
