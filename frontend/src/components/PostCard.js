import { useState } from 'react';
import axios from 'axios';

const PostCard = ({ post, userId }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [liked, setLiked] = useState(post.likes.includes(userId));
  const [commentText, setCommentText] = useState('');

  const toggleLike = async () => {
    const url = liked ? `http://localhost:5000/api/posts/unlike/${post._id}` : `http://localhost:5000/api/posts/like/${post._id}`;
    const res = await axios.put(url, { userId });
    setLikes(res.data.likes.length);
    setLiked(!liked);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    const res = await axios.post(`http://localhost:5000/api/posts/comment/${post._id}`, {
      userId,
      text: commentText,
    });
    setComments(res.data.comments);
    setCommentText('');
  };

  return (
    <div className="border p-4 rounded mb-4">
      <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
      <p className="mt-2">{post.caption}</p>

      <div className="flex items-center space-x-4 mt-2">
        <button onClick={toggleLike}>
          {liked ? '❤️' : '🤍'} {likes} Likes
        </button>
        <span>💬 {comments.length} Comments</span>
      </div>

      <div className="mt-2 flex">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border p-1"
        />
        <button onClick={submitComment} className="bg-blue-500 text-white px-2">Post</button>
      </div>

      <div className="mt-2">
        {comments.slice().reverse().map((c, idx) => (
          <p key={idx}><strong>{c.user?.username||"unknown"}</strong>: {c.text}</p>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
