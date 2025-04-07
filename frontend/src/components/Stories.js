import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stories');
        setStories(response.data);
      } catch (err) {
        console.error('Error fetching stories:', err.message);
      }
    };

    fetchStories();
  }, []);

  return (
    <div>
      <h1>Stories</h1>
      <div className="story-container">
        {stories.map((story) => (
          <div key={story._id} className="story">
            <img src={story.image} alt="Story" />
            <p>{story.user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
