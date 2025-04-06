import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null; // 🚨 Prevent rendering navbar when user not loaded
  console.log("Navbar user:", user);


  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Instagram</Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Feed</Link>
        <Link to={`/profile/${user.user._id}`} className="hover:underline">Profile</Link>


        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
