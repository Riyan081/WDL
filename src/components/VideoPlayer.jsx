import React, { useState, useEffect, useRef } from 'react';
import { videoAPI } from '../services/api';

const VideoPlayer = ({ movie, onClose }) => {
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef(null);

  // Extract YouTube video ID from trailer URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }
    return null;
  };

  const youtubeVideoId = getYouTubeVideoId(movie?.trailerUrl);

  useEffect(() => {
    // Track watch history
    if (movie?.id) {
      videoAPI.updateProgress(movie.id, 0, 'movie').catch(console.error);
    }
  }, [movie]);

  useEffect(() => {
    // Initial hide timer
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard events for ESC key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose]);

  const handleMouseMove = () => {
    setShowControls(true);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleBackgroundClick = (e) => {
    // Close player if clicking on background (not on video)
    if (e.target === e.currentTarget) {
      console.log('🎬 Background clicked - closing player');
      onClose();
    }
  };

  const handleCloseClick = () => {
    console.log('🎬 Close button clicked');
    if (onClose) {
      onClose();
    } else {
      console.error('❌ onClose function not provided');
    }
  };

  if (!movie) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={handleBackgroundClick}
    >
      {/* Video Content */}
      <div className="relative w-full h-full">
        {youtubeVideoId ? (
          // YouTube Video Player
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&controls=1&rel=0&showinfo=0&modestbranding=1`}
            title={movie.title || 'Video Player'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Fallback content display when no video available
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
            <div className="text-center text-white max-w-4xl px-8">
              {/* Movie Poster */}
              {movie.poster && (
                <div className="mb-8">
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-64 h-96 object-cover rounded-lg mx-auto shadow-2xl"
                  />
                </div>
              )}
              
              <h2 className="text-5xl font-bold mb-6">{movie.title}</h2>
              <p className="text-xl mb-8 text-gray-300 leading-relaxed">{movie.description}</p>
              
              <div className="bg-gray-800 bg-opacity-80 p-8 rounded-xl max-w-2xl mx-auto">
                <h3 className="text-3xl mb-6 text-red-500">🎬 Movie Information</h3>
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <p className="mb-2"><strong className="text-red-400">Release Year:</strong> {movie.releaseYear}</p>
                    <p className="mb-2"><strong className="text-red-400">Duration:</strong> {movie.duration} minutes</p>
                    <p className="mb-2"><strong className="text-red-400">Rating:</strong> ⭐ {movie.rating}/5</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong className="text-red-400">Director:</strong> {movie.director}</p>
                    <p className="mb-2"><strong className="text-red-400">Genres:</strong> {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}</p>
                  </div>
                </div>
                
                {movie.cast && Array.isArray(movie.cast) && (
                  <div className="mt-6">
                    <p><strong className="text-red-400">Cast:</strong> {movie.cast.join(', ')}</p>
                  </div>
                )}
                
                <div className="mt-8 p-4 bg-red-900 bg-opacity-50 rounded-lg">
                  <p className="text-yellow-300 text-lg">🎭 Full movie streaming coming soon!</p>
                  <p className="text-gray-400 text-sm mt-2">Currently showing movie details and trailer when available.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <>
          {/* Close Button - Always visible */}
          <div className="absolute top-4 right-4 z-60">
            <button
              onClick={handleCloseClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-2xl font-bold transition-colors shadow-lg border-2 border-white"
              title="Close Player (ESC)"
            >
              ✕
            </button>
          </div>

          {/* Additional close button for mobile/touch */}
          <div className="absolute top-4 left-4 z-60">
            <button
              onClick={handleCloseClick}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              title="Back to Browse"
            >
              ← Back
            </button>
          </div>

          {/* Movie Info Overlay (only show when controls are visible) */}
          {showControls && youtubeVideoId && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-6 rounded-lg">
              <h3 className="text-3xl font-bold mb-3">{movie.title}</h3>
              <p className="text-lg opacity-90 mb-3">{movie.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <span className="bg-red-600 px-3 py-1 rounded">{movie.releaseYear}</span>
                <span>{movie.duration} min</span>
                <span>⭐ {movie.rating}/5</span>
                <span>{Array.isArray(movie.genres) ? movie.genres.join(' • ') : movie.genres}</span>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default VideoPlayer;
