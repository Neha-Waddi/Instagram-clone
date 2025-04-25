import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSettings, FiGrid, FiBookmark, FiUser } from 'react-icons/fi';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import avatar from '../images/avatar.jpeg';
import Sidebar from '../components/SideBar';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const currentUser = authUser?.user;
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const isOwner = currentUser?._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setProfileUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error('Failed to fetch profile');
      }
    };
    fetchProfile();
  }, [id]);

  if (!profileUser) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse">Loading profile...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-16">
      
      <div className="w-20 md:w-64">
        <Sidebar />
      </div>

      {/* Profile Header */}
      <div className="flex items-center px-4 py-8">
        {/* Profile Picture */}
        <div className="w-24 h-24 md:w-32 md:h-32 mr-6">
          <img
            src={profileUser.profilePic || {avatar}}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border border-gray-200"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-light mr-6">{profileUser.username}</h2>
            {isOwner ? (
              <>
                <button 
                  onClick={() => navigate('/edit-profile')}
                  className="px-4 py-1 bg-gray-100 rounded text-sm font-medium mr-2"
                >
                  Edit Profile
                </button>
                <button className="p-1">
                  <Link to='/settings'>
                  <FiSettings className="text-xl"  />
                  </Link>
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-1 bg-blue-500 text-white rounded text-sm font-medium mr-2">
                  Follow
                </button>
                <button className="px-4 py-1 bg-gray-100 rounded text-sm font-medium">
                  Message
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex mb-4">
            <div className="mr-6">
              <span className="font-semibold">{posts.length}</span> posts
            </div>
            <div className="mr-6">
              <span className="font-semibold">0</span> followers
            </div>
            <div>
              <span className="font-semibold">0</span> following
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-semibold">{profileUser.name}</h3>
            <p className="text-gray-800">{profileUser.bio}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-300 flex justify-center">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`flex items-center py-4 px-6 border-t ${activeTab === 'posts' ? 'border-black' : 'border-transparent'}`}
        >
          <FiGrid className="mr-1" />
          <span className="text-xs uppercase tracking-wider">Posts</span>
        </button>
        {isOwner && (
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex items-center py-4 px-6 border-t ${activeTab === 'saved' ? 'border-black' : 'border-transparent'}`}
          >
            <FiBookmark className="mr-1" />
            <span className="text-xs uppercase tracking-wider">Saved</span>
          </button>
        )}
        {isOwner && (
          <button 
            onClick={() => setActiveTab('tagged')}
            className={`flex items-center py-4 px-6 border-t ${activeTab === 'tagged' ? 'border-black' : 'border-transparent'}`}
          >
            <FiUser className="mr-1" />
            <span className="text-xs uppercase tracking-wider">Tagged</span>
          </button>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="text-xl font-light mb-2">No Posts Yet</h3>
            {isOwner && (
              <button 
                onClick={() => navigate('/create-post')}
                className="text-blue-500 font-medium"
              >
                Share your first photo
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="aspect-square relative group cursor-pointer">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="text-white flex items-center mr-6">
                  <span className="font-bold mr-1">{post.likes?.length || 0}</span>
                  ❤️
                </div>
                <div className="text-white flex items-center">
                  <span className="font-bold mr-1">{post.comments?.length || 0}</span>
                  💬
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}