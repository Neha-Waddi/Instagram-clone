// pages/Settings.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // or get from context

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/users/update', {
        userId,
        newEmail,
        newPassword,
      });
      alert('Account updated!');
      setNewEmail('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    }
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Logout failed');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/delete/${userId}`);
      localStorage.clear();
      navigate('/signup');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>

      <hr className="my-4" />

      <button onClick={logout} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Logout
      </button>

      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
      >
        Delete My Account
      </button>
    </div>
  );
};

export default Settings;
