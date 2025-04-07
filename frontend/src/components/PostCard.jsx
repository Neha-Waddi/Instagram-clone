import { useState } from 'react';
import API from '../api';
import avatar from '../images/avatar.jpeg';


export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(post.currentUser));
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');


  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/like/${post._id}`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error('Failed to like/unlike post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/posts/comment/${post._id}`, { text: commentText });
      setComments(res.data.comments);
      setCommentText('');
    } catch (err) {
      console.error('Failed to comment');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      {/* User info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.user?.profilePic || avatar}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-medium text-gray-800">{post.user?.username || 'User'}</span>
      </div>

      {/* Post Image */}
      <div className="mb-3">
        <img
          src={post.image}
          alt="Post"
          className="w-full rounded-xl object-cover max-h-[500px]"
        />
      </div>

      {/* Like & Caption */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={handleLike} className={liked ? 'text-red-500' : 'text-gray-500'}>
          ❤️
        </button>
        <span>{likes} likes</span>
      </div>
      <p className="text-sm text-gray-800 mb-2">{post.caption}</p>

      {/* Comment Input */}
      <form onSubmit={handleComment} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded-full px-3 py-1 text-sm"
        />
        <button type="submit" className="text-sm text-blue-600">Post</button>
      </form>

      {/* Comment List */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {comments.map((c, i) => (
          <div key={i} className="text-sm">
            <strong>{c.user?.name || 'User'}:</strong> {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}
