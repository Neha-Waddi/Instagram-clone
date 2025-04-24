import { useEffect, useState } from 'react';

export default function StoryViewer({ story, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); 
    return () => clearTimeout(timer);
  }, [onClose]);


  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
      <img
  src={story.image}
  alt="Story"
  className="max-h-[80vh] rounded shadow-lg"
/>
          
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
