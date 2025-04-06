// src/components/PostForm.jsx
import { useState } from 'react';
import API from '../api';

export default function PostForm({ onPostCreated }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);

    try {
      setLoading(true);
      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCaption('');
      setImage(null);
      onPostCreated && onPostCreated(res.data); // optional callback to update feed
    } catch (err) {
      console.error('Error uploading post', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-xl mb-4 space-y-3">
      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border px-3 py-2 rounded text-sm"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}
