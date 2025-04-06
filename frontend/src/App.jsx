import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Settings from './pages/settings'; // Fixed case sensitivity
import EditProfile from './pages/EditProfile';
import Create from './pages/Create';
import MessagesPage from './pages/MessagePage';
import Feed from './pages/Feed';
import Reels from './pages/Reels';
import UploadReels from './pages/UploadReel';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/create" element={user ? <Create /> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
        <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/reels" element={user ? <Reels /> : <Navigate to="/login" />} />
        <Route path="/reels/upload" element={user ? <UploadReels /> : <Navigate to="/login" />} />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;