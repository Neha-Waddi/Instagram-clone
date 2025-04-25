import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const Settings = () => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://instagram-clone-m0ay.onrender.com/api/users/update', {
        userId,
        newEmail,
        newPassword,
      });
      alert('Account updated!');
      setNewEmail('');
      setNewPassword('');
    } catch (err) {
      alert('Failed to update');
    }
  };

  const logout = async () => {
    try {
      await axios.get('https://instagram-clone-m0ay.onrender.com/api/auth/logout', {
        withCredentials: true,
      });
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      alert('Logout failed');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account?');
    if (!confirm) return;

    try {
      await axios.delete(`https://instagram-clone-m0ay.onrender.com/api/users/delete/${userId}`);
      localStorage.clear();
      navigate('/signup');
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-white border-r shadow-sm">
        <Sidebar />
      </div>

      {/* Settings Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Account Settings</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-200"
            >
              Update
            </button>
          </form>

          <hr className="my-6 border-gray-300" />

          <button
            onClick={logout}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>

          <button
            onClick={handleDelete}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-200"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
