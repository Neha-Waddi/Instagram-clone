import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.png';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: '🏠', path: '/' },
    { name: 'Search', icon: '🔍', path: '/search' },
    { name: 'Explore', icon: '🌐', path: '/feed' },
    { name: 'Reels', icon: '🎥', path: '/reels' },
    { name: 'Create', icon: '➕', path: '/create' },
    { name: 'Profile', icon: '👤', path: `/profile/${user.user._id}` },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <div className="w-64 fixed left-0 p-4 border-r hidden md:block h-screen">
      <div className="flex items-center mb-10 px-4 py-2 mt-3">
        <img
          src={logo}
          alt="Instagram"
          className="h-8 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      <nav>
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.name}
            className="flex items-center py-3 hover:bg-gray-100 rounded-lg px-2 cursor-pointer"
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-4 text-red-500 w-full py-3 text-center font-semibold hover:bg-red-100 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
