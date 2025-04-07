import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiMessageCircle, FiSend, FiMoreVertical, FiMusic, FiPlus } from 'react-icons/fi';
import avatar from '../images/avatar.jpeg'

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRefs = useRef([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await API.get('/reels');
        setReels(res.data);
      } catch (err) {
        setError('Failed to load reels');
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      reels.forEach((reel, index) => {
        const element = document.getElementById(`reel-${reel._id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -windowHeight/2 && rect.top <= windowHeight/2) {
            setCurrentReelIndex(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reels]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentReelIndex) {
          video.play().catch(err => console.error('Auto-play failed:', err));
        } else {
          video.pause();
        }
      }
    });
  }, [currentReelIndex]);

  const handleLike = async (reelId) => {
    try {
      const res = await API.put(`/reels/like/${reelId}`);
      setReels(reels.map(reel => 
        reel._id === reelId ? res.data : reel
      ));
    } catch (err) {
      console.error('Failed to like reel:', err);
    }
  };

  const handleView = async (reelId) => {
    try {
      await API.put(`/reels/view/${reelId}`);
    } catch (err) {
      console.error('Failed to record view:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="relative bg-black">
      <Link 
        to="/reels/upload"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl z-50 transition-all duration-300"
      >
        <FiPlus size={28} />
      </Link>
      
      {reels.map((reel, index) => (
        <div 
          key={reel._id}
          id={`reel-${reel._id}`}
          className="h-screen w-full snap-start relative flex justify-center"
        >
          <video
            ref={el => videoRefs.current[index] = el}
            src={reel.video}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            onClick={() => videoRefs.current[index].paused ? 
              videoRefs.current[index].play() : 
              videoRefs.current[index].pause()
            }
            onPlay={() => handleView(reel._id)}
          />
          
          {/* Reel overlay UI - redesigned to match the image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex justify-between items-end">
              {/* Left side - user info and caption */}
              <div className="flex-1 max-w-[70%]">
                <div 
                  className="flex items-center mb-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${reel.user._id}`)}
                >
                  <img 
                    src={reel.user?.profilePic || {avatar}} 
                    alt={reel.user?.username}
                    className="w-10 h-10 rounded-full mr-3 border-2 border-white"
                  />
                  <div>
                    <span className="font-bold text-lg block">@{reel.user?.username || 'user'}</span>
                    <span className="text-sm text-gray-300">Follow</span>
                  </div>
                </div>
                
                <p className="text-base mb-3 font-medium">{reel.caption}</p>
                
                <div className="flex items-center bg-black bg-opacity-30 rounded-full px-3 py-1 w-fit">
                  <FiMusic className="mr-2 animate-pulse" />
                  <span className="text-sm truncate">{reel.music || 'Original sound'}</span>
                </div>
              </div>
              
              {/* Right side - actions */}
              <div className="flex flex-col items-center space-y-6 ml-4">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => handleLike(reel._id)}
                    className="bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-all"
                  >
                    <FiHeart 
                      className={`text-3xl ${reel.likes.includes(user?._id) ? 'text-red-500 fill-red-500' : ''}`} 
                    />
                  </button>
                  <span className="text-sm font-medium mt-1">{reel.likes.length}</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <button className="bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-all">
                    <FiMessageCircle className="text-3xl" />
                  </button>
                  <span className="text-sm font-medium mt-1">{reel.comments.length}</span>
                </div>
                
                <button className="bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-all">
                  <FiSend className="text-3xl" />
                </button>
                
                <button className="bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-all">
                  <FiMoreVertical className="text-3xl" />
                </button>
                
                <div className="mt-4">
                  <img 
                    src={reel.user?.profilePic || {avatar}} 
                    alt={reel.user?.username || 'user'}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent -z-10"></div>
          </div>
          
          {/* Top status bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <span className="text-white font-bold text-lg">Reels</span>
            <button className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}