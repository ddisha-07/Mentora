// server.js
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Get this secret from your Supabase Dashboard -> Project Settings -> API -> JWT Secret
const SUPABASE_JWT_SECRET =
  process.env.SUPABASE_JWT_SECRET ||
  process.env.JWT_SECRET ||
  'YOUR_SUPABASE_JWT_SECRET';

// Authentication Middleware
const checkSupabaseAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using your project's unique secret
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);

    // Injects user details (like decoded.sub which is the Supabase User ID) into the request
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Protected endpoint to generate flashcards
app.post('/api/generate-flashcards', checkSupabaseAuth, async (req, res) => {
  // 1. User is verified. You can access their unique ID via req.user.sub
  const userId = req.user.sub;
  const { studyMaterial } = req.body;

  try {
    // 2. Safely call your Gemini API logic here
    // const flashcards = await generateFlashcardsFromGemini(studyMaterial);

    res.json({ message: 'Success', userId, data: [] });
  } catch (err) {
    res.status(500).json({ error: 'Generation failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
