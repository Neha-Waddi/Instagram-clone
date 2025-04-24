import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiX, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import avatar from '../images/avatar.jpeg'
import Sidebar from '../components/SideBar';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`https://instagram-clone-m0ay.onrender.com/api/users/search?q=${query}`, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${currentUser?.token}` 
          }
        });
        setResults(response.data);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search users');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, currentUser?.token]); // Depend on token to re-trigger when token changes

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const handleUserClick = (userId) => {
    clearSearch();
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <Sidebar/>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FiX className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2">
        {results.length > 0 ? (
          results.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={user.profilePic || {avatar}}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                {user.followers?.includes(currentUser?._id) && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                    <FiUser className="text-xs" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </div>
          ))
        ) : (
          query && !loading && (
            <p className="text-center text-gray-500 py-4">
              No users found for "{query}"
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default Search;
