const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API endpoints
app.get('/api/anime', (req, res) => {
    try {
        const animeData = require('../data/anime-data.json');
        res.json(animeData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load anime data' });
    }
});

app.get('/api/users', (req, res) => {
    try {
        const userData = require('../data/users.json');
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load user data' });
    }
});

// All other routes serve the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});