// pages/Profile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import avatar from '../images/avatar.jpeg';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // null initially
  const [isFollowing, setIsFollowing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [newPic, setNewPic] = useState(null);

  // 🔹 Step 1: Get current logged-in user
  useEffect(() => {
    axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
      .then(res => {
        setCurrentUserId(res.data._id);
        console.log('Current User ID:', res.data._id);
      })
      .catch(err => {
        console.error('Error fetching current user:', err);
      });
  }, []);

  // 🔹 Step 2: Fetch profile only after currentUserId is available
  useEffect(() => {
    if (!currentUserId) return;

    axios.get(`http://localhost:5000/api/users/profile/${id}`)
      .then(res => {
        const fetchedUser = res.data.user;
        const fetchedPosts = res.data.posts;
        setUser(fetchedUser);
        setPosts(fetchedPosts);

        console.log("Fetched user:", fetchedUser);
        console.log("Fetched posts:", fetchedPosts);

        // Safe check: only check isFollowing if currentUserId and followers are valid
        const isUserFollowing = fetchedUser.followers?.includes(currentUserId);
        setIsFollowing(isUserFollowing);
      })
      .catch(err => {
        console.error("Error loading profile:", err);
      });
  }, [id, currentUserId]);

  const handleFollowToggle = async () => {
    try {
      const url = isFollowing
        ? `http://localhost:5000/api/users/unfollow/${user._id}`
        : `http://localhost:5000/api/users/follow/${user._id}`;

      await axios.put(url, { userId: currentUserId });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (newPic) formData.append('profilePic', newPic);
    if (newBio) formData.append('bio', newBio);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/profile/update/${id}`,
        formData
      );
      alert('Profile updated!');
      setUser(res.data.user); // update with new user data
      setNewBio('');
      setNewPic(null);
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (!user) return <div className="text-center mt-20">Loading profile...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePic || avatar}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-600">{user.bio}</p>
          <div className="flex space-x-6 mt-2 text-sm text-gray-700">
            <span><strong>{user.followers.length}</strong> Followers</span>
            <span><strong>{user.following.length}</strong> Following</span>
          </div>
          {user._id !== currentUserId && (
            <button
              onClick={handleFollowToggle}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {user._id === currentUserId && (
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
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Update Profile
          </button>
        </form>
      )}

      {/* Posts */}
      <div className="mt-6 space-y-6">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center text-gray-500">No posts yet.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
