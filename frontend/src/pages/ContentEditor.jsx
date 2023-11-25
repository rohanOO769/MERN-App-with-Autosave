// ContentEditor.jsx

import React, { useState, useEffect } from 'react';


const BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

export const ContentEditor = ({ onSave, content }) => {
    const [title, setTitle] = useState(content.title);
    const [body, setBody] = useState(content.body);
  
    // Function to handle save
    const handleSave = (isAutoSave) => {
        let flag;
        if (isAutoSave) {
          console.log('Autosave triggered');
          flag = 'autosave';
        } else {
          console.log('Manual save triggered');
          flag = 'manual';
        }
        console.log(flag);
        onSave(title, body, flag); // Pass 'flag' parameter
        console.log('Received flag:', flag); // Debug statement for received flag

        const apiUrl = flag === 'autosave' ? `${BASE_URL}/autosave` : `${BASE_URL}/content`;

        const requestBody = {
        title,
        body,
        flag,
        };

        fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Failed to save content');
            }
            return response.json();
        })
        .then(data => {
            // Handle the data received after successful response
            console.log(data); // You can process the data here
        })
        .catch(error => {
            throw new Error(error.message);
        });
      };
      
  
    // Function to trigger autosave after 10 seconds
    useEffect(() => {
      const autosaveTimer = setTimeout(() => {
        handleSave(true); // Trigger autosave
      }, 10000);
  
      return () => clearTimeout(autosaveTimer);
    }, [title, body]);

    // Function to restore previous autosaved data
    const restorePreviousData = async () => {
        try {
          const response = await fetch(`${BASE_URL}/autosave/latest`);
          if (!response.ok) {
            throw new Error('Failed to fetch latest autosaved data');
          }
          const data = await response.json();
          setTitle(data.title);
          setBody(data.body);
        } catch (error) {
          console.error('Error restoring previous data:', error);
        }
      };

    useEffect(() => {
        const shouldRestoreData = window.confirm('Seems like your page accidentally closed.\nPress OK to restore previous data.');
        if (shouldRestoreData) {
        restorePreviousData();
        }
    }, []);

    return (
        <div className="content-editor" >
          <h1>Blog Page</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
          ></textarea>
          <button onClick={() => handleSave(false)}>Save</button>
            
           
        </div>
        
      );
  };

  export const getContent = async () => {
    try {
      const response = await fetch(`${BASE_URL}/content`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  };
