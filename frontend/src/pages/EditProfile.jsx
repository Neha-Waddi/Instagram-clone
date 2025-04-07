// src/pages/EditProfile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import avatar from '../images/avatar.jpeg'

export default function EditProfile() {
  const { user, login } = useAuth();
  const currentUser = user?.user;
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(currentUser?.profilePic || {avatar});

  useEffect(() => {
    if (profilePic) {
      const url = URL.createObjectURL(profilePic);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profilePic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (profilePic) formData.append('profilePic', profilePic);

      const res = await API.put(`/users/update/${currentUser._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      login({ ...user, user: res.data.user }); // update localStorage & context
      navigate(`/profile/${currentUser._id}`);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={preview}
            alt="Profile Preview"
            className="w-16 h-16 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border px-3 py-2 rounded resize-none"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
