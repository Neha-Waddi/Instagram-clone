import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { FiUpload, FiX, FiVideo } from 'react-icons/fi';

export default function UploadReels() {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('video', video);
    formData.append('caption', caption);

    try {
      await API.post('/reels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/reels'); // Redirect after successful upload
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload Reel</h2>
          <button 
            onClick={() => navigate('/reels')}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        {preview ? (
          <div className="mb-4">
            <video 
              src={preview} 
              controls 
              className="w-full max-h-96 rounded-lg"
            />
          </div>
        ) : (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mb-4"
            onClick={() => fileInputRef.current.click()}
          >
            <FiVideo className="mx-auto text-3xl mb-2 text-gray-400" />
            <p className="font-medium">Select video to upload</p>
            <p className="text-sm text-gray-500">MP4 or MOV, up to 100MB</p>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleVideoChange}
          accept="video/*"
          className="hidden"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={!video || loading}
            className={`w-full py-2 rounded font-medium ${
              !video || loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {loading ? 'Uploading...' : 'Share Reel'}
          </button>
        </form>
      </div>
    </div>
  );
}