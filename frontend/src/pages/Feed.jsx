import { useEffect, useState, useRef } from 'react';
import API from '../api';
import { FiCompass, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTags, setTrendingTags] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loaderRef = useRef(null);

  const fetchPopularPosts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/explore?page=${page}`);
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTags = async () => {
    try {
      const res = await API.get('/posts/trending/tags');
      setTrendingTags(res.data);
    } catch (err) {
      console.error('Failed to fetch trending tags');
    }
  };

  const searchPosts = async () => {
    if (!searchQuery.trim()) {
      fetchPopularPosts();
      return;
    }
    
    setLoading(true);
    try {
      const res = await API.get(`/posts/search?q=${searchQuery}`);
      setPosts(res.data.results);
    } catch (err) {
      console.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      
    }
  };
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchPopularPosts();
    }
  }, [page]);
  

  useEffect(() => {
    fetchTrendingTags();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Explore Header */}
      <div className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center">
            <FiCompass className="mr-2" /> Explore
          </h1>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="my-4">
        <h2 className="text-lg font-semibold">Trending Tags</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {trendingTags.map((tag) => (
            <span key={tag} className="text-sm text-blue-500 cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No posts found' : 'No popular posts right now'}
          </p>
          {!searchQuery && (
            <button 
              onClick={fetchPopularPosts}
              className="mt-4 text-blue-500 font-medium"
            >
              Refresh
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <Link 
              key={post._id} 
              to={`/p/${post._id}`}
              className="aspect-square relative group"
            >
              <img
                src={post.image}
                alt={post.caption}
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
            </Link>
          ))}
        </div>
      )}

      {/* Loader for infinite scroll */}
      <div ref={loaderRef} className="text-center py-4">
        {loading && <div className="text-gray-500">Loading more posts...</div>}
      </div>
    </div>
  );
}
