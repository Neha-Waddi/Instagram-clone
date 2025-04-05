import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <div className="mt-4 space-y-2">
        {results.map((user) => (
          <Link to={`/profile/${user._id}`} key={user._id} className="flex items-center space-x-2">
            <img src={user.profilePic} alt="profile" className="w-10 h-10 rounded-full" />
            <span>{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
