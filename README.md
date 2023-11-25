# MERN-App-with-Autosave

Overview
This project is a content management system built using React for the frontend and Express for the backend. It allows users to create, edit, and view blog content. MongoDB is used as the database to store the content data.

Features
Content Editor
Create and Edit Content
Users can create new blog posts or edit existing ones using a simple editor interface.

Autosave Functionality
The editor automatically saves content drafts every 10 seconds to prevent data loss.

Manual Save
Users can manually save their content to update the database.

Restore Previous Data
In case of accidental closure, the system prompts the user to restore their last autosaved content.

Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Other Tools: React Router, Mongoose
How to Run
Prerequisites
Node.js installed
MongoDB installed or access to a MongoDB instance

# Setup Instructions
# Navigate to the project directory
cd project-directory

# Install dependencies for frontend
cd frontend
npm install

# Install dependencies for backend
cd ../backend
npm install
Starting the Application

# Start the backend server
cd backend
npm start
bash
Copy code
# Start the frontend application
cd frontend
npm start
Access the application in your browser: http://localhost:3000

# API Endpoints
#### POST /api/content: Create new blog content.
#### POST /api/autosave: Save content drafts (autosave).
#### GET /api/autosave/latest: Retrieve the latest autosaved content.
#### PUT /api/content/:id: Update existing content by ID.
#### DELETE /api/content/:id: Delete content by ID.
#### GET /api/content: Retrieve all content.
#### GET /api/content/:id: Retrieve content by ID.

