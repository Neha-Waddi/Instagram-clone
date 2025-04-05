// pages/Profile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import avatar from '../images/avatar.jpeg';
import PostCard from '../components/PostCard';


const Profile = () => {
  const { id } = useParams(); // User ID from route
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // 🔽 New states for form inputs
  const [newBio, setNewBio] = useState('');
  const [newPic, setNewPic] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/profile/${id}`)
      .then((res) => {
        setUser(res.data.user);
        setPosts(res.data.posts);
      })
      .catch((err) => {
        console.error("❌ Error loading profile:", err.response?.data || err.message);
      });
  }, [id]);
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (newPic) formData.append('profilePic', newPic);
    if (newBio) formData.append('bio', newBio);

    try {
      const res = await axios.put(`http://localhost:5000/api/users/profile/update/${id}`, formData);
      alert('Profile updated!');
      setUser(res.data.user); // Refresh profile info
      setNewBio('');
      setNewPic(null);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePic || avatar}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-600">{user.bio}</p>
        </div>
      </div>

      {/* 🔽 Profile Update Form */}
      <form onSubmit={handleUpdate} className="mt-6 space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewPic(e.target.files[0])}
          className="block"
        />
        <input
          type="text"
          placeholder="Update your bio"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          className="w-full border p-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Update Profile
        </button>
      </form>

      {/* Posts */}
      <div className="mt-6 space-y-6">
  {posts.map((post) => (
    <PostCard key={post._id} post={post} userId={user._id} />
  ))}
</div>

    </div>
  );
};

export default Profile;
