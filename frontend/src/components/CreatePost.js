import { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ userId }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert('Please select an image');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);
    formData.append('userId', userId);

    try {
        await axios.post('http://localhost:5000/api/posts', formData);

      setMessage('✅ Post uploaded!');
      setCaption('');
      setImage(null);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setMessage(`❌ Upload failed: ${errorMsg}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      {image && <img src={URL.createObjectURL(image)} alt="Preview" className="w-40 h-40 object-cover" />}
      <input
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Post</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreatePost;
