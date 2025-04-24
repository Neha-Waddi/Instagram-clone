import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import API from '../api';
import { useAuth } from '../context/AuthContext'; 
import PostCard from '../components/PostCard';
import StoryBar from '../components/StoryBar';
import avatar from '../images/avatar.jpeg';
import UploadStory from '../components/UploadStory';
import Sidebar from '../components/SideBar';

export default function Home() {
  const { user } = useAuth();  
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

 

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar/>

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

          {["Nani", "Tilak_Varma" , "Karthik"].map((item) => (
            <div key={item} className="flex items-center justify-between mb-3">
              <div className="flex items-center cursor-pointer" onClick={() => navigate(`/profile/user${item}`)}>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                <div className="ml-2">
                  <p className="text-sm font-semibold">{item}</p>
                  <p className="text-xs text-gray-500">Followed by Meera</p>
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
