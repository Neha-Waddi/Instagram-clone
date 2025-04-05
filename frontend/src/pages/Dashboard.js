import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, Outlet } from "react-router-dom";
import logo from "../images/logo.png";
import Feed from "./Feed.js"
import Stories from "../components/Stories.js";
import { Home, Search, PlusCircle, Heart, User, Menu ,Compass ,PlayCircle,MessageSquare,Settings} from "lucide-react"; // Added Menu icon
import UploadStory from "../components/uploadStory.js";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div className="bg-black min-h-screen flex">
      {/* Left Sidebar (Desktop) */}
      <div className="w-64 px-4 py-6 bg-white border-r border-gray-800 text-black hidden md:flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center px-10"><img src={logo} alt="Instagram" height={50} width={100}/></h1>
        </div>
        <nav className="flex-1 space-y-6">
          <NavItem icon={<Home size={26} />} label="Home" to="/dashboard" />
          <NavItem icon={<Search size={26} />} label="Search" to="/search" />
          <NavItem icon={<Compass size={26} />} label="Explore" to="/explore" /> 
          <NavItem icon={<PlayCircle size={26} />} label="Reels" to="/reels" />     
          <NavItem icon={<MessageSquare size={26} />} label="Messages" to="/messages" /> 
          <NavItem icon={<Heart size={26} />} label="Notifications" to="/notifications" />
          <NavItem icon={<PlusCircle size={26} />} label="Create" to="/create" />
          <NavItem icon={<Settings size={26} />} label="Settings" to="/settings" />
          <NavItem icon={<User size={26} />} label="Profile" to={`/profile/${user?.id || 'me'}`} />
          <NavItem icon={<Menu size={26} />} label="More" to="/more" />  
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto bg-black text-white">
        {/* Top Navigation Bar (Desktop & Mobile) */}
        <div className="bg-zinc-900 border-b border-zinc-800 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button className="md:hidden mr-4">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold">Instagram</h1>
          </div>
          <div className="flex items-center">
            {/* Add other top navigation icons here if needed */}
          </div>
        </div>

        {/* Stories Section */}
        <div className="bg-zinc-900 border-b border-zinc-800 p-4 overflow-x-auto">
          <div className="flex space-x-4">
            {/* Your Story */}
            <div className="flex flex-col items-center justify-center cursor-pointer">
              <div className="relative w-16 h-16 rounded-full bg-gray-700 border border-zinc-800">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Your Story"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  +
                </div>
              </div>
              <span className="text-xs text-center mt-1 truncate w-16">Your Story</span>
            </div>
            <UploadStory/>
            <Stories/>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <Outlet /> <Feed/>
        </div>
      </div>

      {/* Right Sidebar (Desktop) */}
      <div className="hidden lg:flex flex-col w-80 px-4 py-6 bg-black border-l border-zinc-800 text-white">
        <div className="mb-6">
          <p className="font-semibold text-gray-400 text-sm mb-2">Suggestions For You</p>
          <ul className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
                    <img
                      src={`https://via.placeholder.com/32?text=Suggest${i + 1}`}
                      alt={`Suggestion ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-300">suggested_user_{i + 1}</span>
                </div>
                <button className="text-xs font-semibold text-blue-500">Follow</button>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} Instagram Clone by You
        </p>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 flex justify-around py-2">
        <Link to="/" className="flex flex-col items-center text-gray-400">
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center text-gray-400">
          <Search size={24} />
          <span className="text-xs">Search</span>
        </Link>
        <Link to="/create" className="flex flex-col items-center text-gray-400">
          <PlusCircle size={24} />
          <span className="text-xs">Create</span>
        </Link>
        <Link to="/notifications" className="flex flex-col items-center text-gray-400">
          <Heart size={24} />
          <span className="text-xs">Likes</span>
        </Link>
        <Link to={`/profile/${user?.username || 'me'}`} className="flex flex-col items-center text-gray-400">
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
}

function NavItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-3 text-gray-700 hover:text-white cursor-pointer"
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </Link>
  );
}

export default Dashboard;