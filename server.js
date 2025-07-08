const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const noteSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

app.get('/', (req, res) => {
  res.send('📝 Notes API with MongoDB is running!');
});

app.get('/notes', async (req, res) => {
  const { search } = req.query;
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
        ]
      }
    : {};
  const notes = await Note.find(query).sort({ createdAt: -1 });
  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const { title, content, tags } = req.body;
  const newNote = new Note({
    id: uuidv4(),
    title,
    content,
    tags: tags || []
  });
  await newNote.save();
  res.status(201).json(newNote);
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  await Note.deleteOne({ id });
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
