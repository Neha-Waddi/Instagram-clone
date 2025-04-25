import { useState } from 'react';
import PostForm from '../components/PostForm';  // Import PostForm component
import Sidebar from '../components/SideBar';

export default function Create() {
  const [newPost, setNewPost] = useState(null);

  const handlePostCreated = (post) => {
    setNewPost(post);
    // You can also handle any additional logic after a post is created
  };

  return (
    <div className="max-w-lg mx-auto p-4">
        <div className="w-20 md:w-64">
              <Sidebar />
            </div>
      
      <h1 className="text-2xl font-semibold mb-4">Create a New Post</h1>
      
      <PostForm onPostCreated={handlePostCreated} />  {/* Add PostForm component here */}

      {newPost && (
        <div className="mt-4">
          <h3 className="font-semibold">Your Post</h3>
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <p>{newPost.caption}</p>
            {newPost.image && <img src={newPost.image} alt="Post" className="w-full mt-2 rounded" />}
          </div>
        </div>
      )}
    </div>
  );
}
