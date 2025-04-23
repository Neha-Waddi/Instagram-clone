import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import API from '../api';
import { useAuth } from '../context/AuthContext'; 
import PostCard from '../components/PostCard';
import StoryBar from '../components/StoryBar';
import logo from '../images/logo.png';
import avatar from '../images/avatar.jpeg';
import UploadStory from '../components/UploadStory';

export default function Home() {
  const { user, logout } = useAuth();  
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); 
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts/feed');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts');
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [user]);

 
  const navItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Search', icon: '🔍', path: '/search' },
    { name: 'Explore', icon: '🌐', path: '/feed' },
    { name: 'Reels', icon: '🎥', path: '/reels' },
    { name: 'Create', icon: '➕', path: '/create' },
    { name: 'Profile', icon: '👤', path: `/profile/${user.user._id}` },
    { name: 'Settings', icon: '⚙️', path: '/settings' },

  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ----- LEFT SIDEBAR ----- */}
      <div className="w-64 fixed left-0 p-4 border-r hidden md:block">
        <div className="flex items-center mb-10 px-4 py-2 mt-3">
          <img 
            src={logo}
            alt="Instagram" 
            className="h-8 cursor-pointer"
            onClick={() => navigate('/')}

          />
        </div>
        <nav>
          {navItems.map((item) => (
            <Link 
              to={item.path} 
              key={item.name}
              className="flex items-center py-3 hover:bg-gray-100 rounded-lg px-2 cursor-pointer"
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        {/* Logout Button */}
        <button
          onClick={logout}
          className="mt-4 text-red-500 w-full py-3 text-center font-semibold hover:bg-red-100 rounded-lg"
        >
          Logout
        </button>
       

      </div>

      {/* ----- MAIN CONTENT ----- */}
      <div className="flex-1 md:ml-64 max-w-2xl mx-auto">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-sm overflow-x-auto">
        <UploadStory/>
        <StoryBar/>
        </div>
        

        <div className="space-y-6">
          
          {posts.length === 0 ? (
            <p className="text-center py-10">No posts yet</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>

      {/* ----- RIGHT SIDEBAR ----- */}
      <div className="w-80 fixed right-0 p-4 hidden lg:block">
        <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
          <div className="flex items-center mb-6">
            <img 
              src={user.user.profilePic || avatar} 
              alt="Profile" 
              className="h-12 w-12 rounded-full cursor-pointer"
              onClick={() => navigate(`/profile/${user.user._id}`)}
            />
            <div className="ml-4">
              <p className="font-semibold cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                {user.user.username}
              </p>
              <p className="text-gray-500">{user?.name}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 font-semibold">Suggestions For You</h3>
            <button className="text-xs font-semibold">See All</button>
          </div>

          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between mb-3">
              <div className="flex items-center cursor-pointer" onClick={() => navigate(`/profile/user${item}`)}>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                <div className="ml-2">
                  <p className="text-sm font-semibold">username_{item}</p>
                  <p className="text-xs text-gray-500">Followed by user{item + 1}</p>
                </div>
              </div>
              <button className="text-blue-500 text-xs font-semibold">Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
