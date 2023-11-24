// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the provided URI
mongoose.connect('mongodb+srv://aminrohan54:admin@python.jdnsost.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Check MongoDB connection status
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

// Counter variables
let counter = 0;

// Function to increment counter and get next value
async function getNextSequenceValue() {
  try {
    const contentCount = await Content.countDocuments();
    counter = contentCount > 0 ? (await Content.findOne().sort({ _id: -1 }))._id + 1 : 1;
    return counter;
  } catch (error) {
    console.error('Error while getting next sequence value:', error);
    throw error;
  }
}


// Content schema and model
const contentSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  body: String,
  // Other fields as needed
});

const Content = mongoose.model('Content', contentSchema);

// Endpoint to save new content
app.post('/api/content', async (req, res) => {
  const { title, body } = req.body;

  try {
    const id = await getNextSequenceValue(); // Get the next ID

    // Create a new content item with the generated ID
    const newContent = new Content({
      _id: id,
      title,
      body,
    });

    // Save the new content
    await newContent.save();

    return res.status(201).json({ message: 'Content created successfully', content: newContent });
  } catch (error) {
    console.error('Error while creating content:', error);
    return res.status(500).json({ error: 'An error occurred while creating content' });
  }
});

let autosaveCounter = 0;

// In-memory cache for autosave content
var latestAutosave = {};

// Function to increment autosave counter and get next value
async function getNextAutosaveSequenceValue() {
  autosaveCounter++;
  return autosaveCounter;
}

// Endpoint to save autosave content into the cache
app.post('/api/autosave', async (req, res) => {
  const { title, body } = req.body;

  try {
    autosaveCounter++; // Increment the autosave counter
    // Create a new autosave content item
    const newAutosaveContent = {
      _id: autosaveCounter,
      title,
      body,
    };

    // Save the new autosave content in the in-memory cache
    latestAutosave = newAutosaveContent;

    return res.status(200).json({ message: 'Autosave content saved to cache', content: newAutosaveContent });
  } catch (error) {
    console.error('Error while saving autosave content:', error);
    return res.status(500).json({ error: 'An error occurred while saving autosave content' });
  }
});

// Endpoint to retrieve the latest autosave content from the cache
app.get('/api/autosave/latest', async (req, res) => {
  try {
    if (!latestAutosave) {
      return res.status(404).json({ error: 'No autosave content found' });
    }

    return res.status(200).json(latestAutosave);
  } catch (error) {
    console.error('Error while retrieving latest autosave content:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving latest autosave content' });
  }
});


// Update endpoint to modify existing content by ID
app.put('/api/content/:id', async (req, res) => {
  const { title, body } = req.body;
  const contentId = req.params.id;

  try {
    let content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Update the content
    content.title = title;
    content.body = body;
    await content.save();

    return res.status(200).json({ message: 'Content updated successfully', content });
  } catch (error) {
    console.error('Error while updating content:', error);
    return res.status(500).json({ error: 'An error occurred while updating content' });
  }
});

// Delete endpoint to remove content by ID
app.delete('/api/content/:id', async (req, res) => {
  const contentId = req.params.id;

  try {
    const deletedContent = await Content.findByIdAndDelete(contentId);

    if (!deletedContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    return res.status(200).json({ message: 'Content deleted successfully', content: deletedContent });
  } catch (error) {
    console.error('Error while deleting content:', error);
    return res.status(500).json({ error: 'An error occurred while deleting content' });
  }
});

// Get all data
app.get('/api/content', async (req, res) => {
  try {
    const allContent = await Content.find();
    return res.status(200).json(allContent);
  } catch (error) {
    console.error('Error while retrieving all content:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving content' });
  }
});
// Get by ID
app.get('/api/content/:id', async (req, res) => {
  const contentId = req.params.id;

  try {
    const content = await Content.findById(contentId);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    return res.status(200).json(content);
  } catch (error) {
    console.error('Error while retrieving content by ID:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving content' });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
