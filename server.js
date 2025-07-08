const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let notes = [];

// Root route to verify server is running
app.get('/', (req, res) => {
  res.send('📝 Notes API is running!');
});

// Get all notes or filtered by search query
app.get('/notes', (req, res) => {
  const { search } = req.query;
  const filtered = search
    ? notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    : notes;
  res.json(filtered);
});

// Create a new note
app.post('/notes', (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newNote = {
    id: uuidv4(),
    title,
    content,
    tags: tags || [],
    createdAt: new Date()
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== id);

  if (notes.length === initialLength) {
    return res.status(404).json({ error: 'Note not found.' });
  }

  res.status(204).send();
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
