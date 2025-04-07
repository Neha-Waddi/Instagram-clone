// src/components/StoryBar.jsx
import { useEffect, useState } from 'react';
import API from '../api';
import StoryViewer from './StoryViewer';

export default function StoryBar() {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await API.get('/stories');
        setStories(res.data);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      }
    };
    fetchStories();
  }, []);

  return (
    <>
      {activeStory && (
        <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
      )}
      <div className="flex gap-3 overflow-x-auto py-2 px-4 bg-white shadow-sm">
        {stories.map((story) => (
          <div
            key={story._id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setActiveStory(story)}
          >
            <img
              src={story.image}
              alt="Story"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
            />
            <span className="text-xs mt-1">
              {story.user?.username || 'Unknown'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
