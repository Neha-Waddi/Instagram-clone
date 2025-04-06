// src/components/CreatePost.jsx
import { useState } from 'react';
import API from '../api';

export default function CreatePost({ onPostCreated }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !caption) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      setLoading(true);
      const res = await API.post('/posts', formData);
      onPostCreated && onPostCreated(res.data);
      setCaption('');
      setImage(null);
    } catch (err) {
      console.error('Post upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded-xl mb-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border rounded-md p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
