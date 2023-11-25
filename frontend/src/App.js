// App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {  ContentEditor, getContent } from './pages/ContentEditor'; // Adjust the path based on your actual file structure
import ViewContent from './pages/ViewContent'; // Adjust the path based on your actual file structure
import "./pages/styles.css"

function App() {
  const [content, setContent] = useState({ title: '', body: '' });

  useEffect(() => {
    // Fetch content when the app mounts
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const fetchedContent = await getContent();
      setContent(fetchedContent);
    } catch (error) {
      console.error('Error fetching content:', error.message);
    }
  };

  const handleSave = async (title, body) => {
    try {
      ContentEditor(title, body);
      // Fetch updated content after saving
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error.message);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ContentEditor onSave={handleSave} content={content} />} // Pass content and onSave function to ContentEditor
        />
        <Route
          path="/view"
          element={<ViewContent content={content} />} // Pass content to ViewContent
        />
      </Routes>
    </Router>
  );
}

export default App;