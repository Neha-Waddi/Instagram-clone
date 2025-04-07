// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { FiInstagram } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          {/* Instagram Logo */}
          <div className="flex justify-center mb-8">
            <FiInstagram className="text-5xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Facebook Login */}
          <div className="text-center mb-6">
            <button className="text-sm text-blue-900 font-medium flex items-center justify-center w-full">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
              Log in with Facebook
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <a href="#" className="text-xs text-blue-900">Forgot password?</a>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="bg-white p-4 mt-3 text-center border border-gray-200 rounded-lg">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* App Download Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white mb-3">Get the app.</p>
          <div className="flex justify-center space-x-2">
            <button className="w-32 h-10 bg-black rounded">
              <img 
                src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" 
                alt="App Store" 
                className="w-full h-full object-contain"
              />
            </button>
            <button className="w-32 h-10 bg-black rounded">
              <img 
                src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" 
                alt="Play Store" 
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}