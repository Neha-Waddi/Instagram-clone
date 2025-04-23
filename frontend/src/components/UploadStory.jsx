import React, { useState } from 'react';
import axios from 'axios';

const UploadStory = () => {
  const [media, setMedia] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    console.log('UserId:', userId);

    if (!media || !userId) return alert('Missing file or user.');

    const formData = new FormData();
    formData.append('story', media);
    formData.append('userId', userId);

    try {
      await axios.post('https://instagram-clone-m0ay.onrender.com/api/stories/upload', formData, {
        withCredentials: true,
      });
      alert('Story uploaded!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleUpload} className="p-4">
      <input type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files[0])} />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload Story
      </button>
    </form>
  );
};

export default UploadStory;
