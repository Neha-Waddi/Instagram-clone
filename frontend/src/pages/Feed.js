import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-6">Loading posts...</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} userId={post.user?._id} />
      ))}
    </div>
  );
};

export default Feed;
