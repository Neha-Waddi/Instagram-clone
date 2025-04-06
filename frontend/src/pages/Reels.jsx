import { useEffect, useRef, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiMessageCircle, FiSend, FiMoreVertical, FiMusic ,FiPlus} from 'react-icons/fi';

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
    //   const scrollPosition = window.scrollY;
      
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
    // Play current video and pause others
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
    <div className="relative">
      <Link 
        to="/reels/upload"
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50"
      >
        <FiPlus size={24} />
      </Link>
      {reels.map((reel, index) => (
        <div 
          key={reel._id}
          id={`reel-${reel._id}`}
          className="h-screen w-full snap-start relative"
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
          
          {/* Reel overlay UI */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex justify-between items-end">
              {/* Left side - user info and caption */}
              <div className="flex-1">
                <div 
                  className="flex items-center mb-2 cursor-pointer"
                  onClick={() => navigate(`/profile/${reel.user._id}`)}
                >
                  <img 
                    src={reel.user.profilePic || '/default-profile.png'} 
                    alt={reel.user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="font-semibold">@{reel.user.username}</span>
                </div>
                <p className="text-sm mb-2">{reel.caption}</p>
                <div className="flex items-center text-sm">
                  <FiMusic className="mr-1" />
                  <span>{reel.music || 'Original sound'}</span>
                </div>
              </div>
              
              {/* Right side - actions */}
              <div className="flex flex-col items-center space-y-4 ml-4">
                <button 
                  onClick={() => handleLike(reel._id)}
                  className="flex flex-col items-center"
                >
                  <FiHeart 
                    className={`text-2xl ${reel.likes.includes(user?._id) ? 'text-red-500 fill-red-500' : ''}`} 
                  />
                  <span className="text-xs">{reel.likes.length}</span>
                </button>
                
                <button className="flex flex-col items-center">
                  <FiMessageCircle className="text-2xl" />
                  <span className="text-xs">{reel.comments.length}</span>
                </button>
                
                <button className="flex flex-col items-center">
                  <FiSend className="text-2xl" />
                </button>
                
                <button>
                  <FiMoreVertical className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}