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

// Example schema for content/blog
const contentSchema = new mongoose.Schema({
  title: String,
  body: String,
  // Add other fields as needed
});

const Content = mongoose.model('Content', contentSchema);

// Autosave endpoint to save content
app.post('/api/autosave', async (req, res) => {
  const { title, body } = req.body;

  try {
    // Check if the content exists, update if yes, create new if no
    let content = await Content.findOne();

    if (!content) {
      content = new Content({
        title,
        body,
      });
    } else {
      content.title = title;
      content.body = body;
    }

    // Save the content
    await content.save();

    return res.status(200).json({ message: 'Content autosaved successfully' });
  } catch (error) {
    console.error('Error while autosaving content:', error);
    return res.status(500).json({ error: 'An error occurred while autosaving content' });
  }
});

// Example endpoint to retrieve the latest saved content
app.get('/api/content', async (req, res) => {
  try {
    const content = await Content.findOne();
    return res.status(200).json(content);
  } catch (error) {
    console.error('Error while retrieving content:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving content' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
