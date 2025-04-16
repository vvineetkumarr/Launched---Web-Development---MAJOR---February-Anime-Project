const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
const uri = "mongodb://127.0.0.1:27017/animeTracker";
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000
});

// Connect to DB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

// Routes
app.get('/api/anime', async (req, res) => {
  try {
    const db = await connectDB();
    const anime = await db.collection('anime').find({}).toArray();
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const anime = await db.collection('anime').findOne({ id: parseInt(req.params.id) });
    res.json(anime || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});