import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const Explore = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts/trending")
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to fetch trending", err));
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Trending Posts</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
