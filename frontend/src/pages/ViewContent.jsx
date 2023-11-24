// ViewContent.jsx

import React from 'react';

const ViewContent = ({ content }) => {
  return (
    <div>
      <h1>View Content</h1>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
    </div>
  );
};

export default ViewContent;