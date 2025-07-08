const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let notes = [];

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

app.post('/notes', (req, res) => {
  const { title, content, tags } = req.body;
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

app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  notes = notes.filter(note => note.id !== id);
  res.status(204).send();
});

app.listen(5000, () => console.log('🚀 Server started on http://localhost:5000'));
