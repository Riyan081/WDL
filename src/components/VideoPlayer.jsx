import React, { useState, useEffect, useRef } from 'react';
import { videoAPI, seriesAPI } from '../services/api';

const VideoPlayer = ({ movie, series, episode, onClose }) => {
  const [showControls, setShowControls] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [seriesData, setSeriesData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode || null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Determine what content we're playing
  const content = currentEpisode || movie;
  const isEpisode = !!currentEpisode;
  const isSeries = !!series;

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

  const youtubeVideoId = getYouTubeVideoId(content?.trailerUrl || content?.videoUrl);

  // Fetch series data and episodes if we're dealing with a series
  useEffect(() => {
    const fetchSeriesEpisodes = async () => {
      if (series) {
        setLoading(true);
        try {
          setSeriesData(series);
          
          // Fetch real episodes from API
          const response = await seriesAPI.getSeriesEpisodes(series.id);
          
          if (response.success && response.data) {
            setEpisodes(response.data);
            
            // If no current episode is set, set the first episode
            if (!currentEpisode && response.data.length > 0) {
              setCurrentEpisode(response.data[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching episodes:', error);
          // Fallback to mock episodes if API fails
          const mockEpisodes = [
            {
              id: 1,
              title: "Episode 1: Pilot",
              description: "The beginning of an epic journey...",
              episodeNumber: 1,
              duration: 45,
              videoUrl: "https://www.youtube.com/watch?v=mnd7sFt5c3A",
              thumbnail: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=800",
              season: { seasonNumber: 1, series: series }
            }
          ];
          setEpisodes(mockEpisodes);
        }
        setLoading(false);
      }
    };

    fetchSeriesEpisodes();
  }, [series]);

  useEffect(() => {
    // Track watch history
    if (content?.id) {
      const contentType = isEpisode ? 'episode' : 'movie';
      videoAPI.updateProgress(content.id, 0, contentType).catch(console.error);
    }
  }, [content, isEpisode]);

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

  const handleEpisodeSelect = (episode) => {
    setCurrentEpisode(episode);
    setShowDetails(false);
  };

  const getNextEpisode = () => {
    if (!isEpisode || !episodes.length) return null;
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    return currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
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

  if (!content) return null;

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
            title={content.title || 'Video Player'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Fallback content display when no video available
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center text-white px-8">
              {/* Content Poster */}
              {content.poster && (
                <div className="mb-8">
                  <img 
                    src={content.poster} 
                    alt={content.title}
                    className="w-64 h-96 object-cover rounded-lg mx-auto shadow-2xl"
                  />
                </div>
              )}
              
              <div className="text-center max-w-4xl">
                <h2 className="text-5xl font-bold mb-6">{content.title}</h2>
                {isEpisode && (
                  <div className="mb-4">
                    <span className="bg-red-600 px-4 py-2 rounded-full text-lg">
                      Season {currentEpisode.seasonNumber} • Episode {currentEpisode.episodeNumber}
                    </span>
                  </div>
                )}
                <p className="text-xl mb-8 text-gray-300 leading-relaxed">{content.description}</p>
                
                <div className="bg-gray-800 bg-opacity-80 p-8 rounded-xl max-w-2xl mx-auto">
                  <h3 className="text-3xl mb-6 text-red-500">
                    {isEpisode ? '📺 Episode Information' : '🎬 Movie Information'}
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-left">
                    <div>
                      {!isEpisode && <p className="mb-2"><strong className="text-red-400">Release Year:</strong> {content.releaseYear}</p>}
                      <p className="mb-2"><strong className="text-red-400">Duration:</strong> {content.duration} minutes</p>
                      <p className="mb-2"><strong className="text-red-400">Rating:</strong> ⭐ {content.rating || (series?.rating) || 'N/A'}/5</p>
                    </div>
                    <div>
                      {!isEpisode && <p className="mb-2"><strong className="text-red-400">Director:</strong> {content.director}</p>}
                      {isEpisode && series && <p className="mb-2"><strong className="text-red-400">Series:</strong> {series.title}</p>}
                      <p className="mb-2"><strong className="text-red-400">Genres:</strong> {Array.isArray(content.genres || series?.genres) ? (content.genres || series.genres).join(', ') : (content.genres || series?.genres)}</p>
                    </div>
                  </div>
                  
                  {(content.cast || series?.cast) && (
                    <div className="mt-6">
                      <p><strong className="text-red-400">Cast:</strong> {Array.isArray(content.cast || series.cast) ? (content.cast || series.cast).join(', ') : (content.cast || series.cast)}</p>
                    </div>
                  )}
                  
                  {/* Next Episode Button */}
                  {isEpisode && getNextEpisode() && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleEpisodeSelect(getNextEpisode())}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        ▶ Next Episode: {getNextEpisode().title}
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-8 p-4 bg-red-900 bg-opacity-50 rounded-lg">
                    <p className="text-yellow-300 text-lg">
                      {isEpisode ? '📺 Full episode streaming coming soon!' : '🎭 Full movie streaming coming soon!'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">Currently showing {isEpisode ? 'episode' : 'movie'} details and trailer when available.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Episode List Sidebar for Series */}
            {(isSeries || isEpisode) && episodes.length > 0 && (
              <div className="w-80 bg-black bg-opacity-90 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Episodes</h3>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-red-400 hover:text-red-300"
                  >
                    {showDetails ? 'Hide' : 'Details'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentEpisode?.id === ep.id 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                      onClick={() => handleEpisodeSelect(ep)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                          EP {ep.episodeNumber}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm truncate">{ep.title}</h4>
                          <p className="text-xs opacity-75">{ep.duration} min</p>
                        </div>
                      </div>
                      {showDetails && (
                        <p className="text-xs mt-2 opacity-75 line-clamp-2">{ep.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <h3 className="text-3xl font-bold mb-3">{content.title}</h3>
              {isEpisode && (
                <p className="text-lg text-red-400 mb-2">
                  Season {currentEpisode.seasonNumber} • Episode {currentEpisode.episodeNumber}
                </p>
              )}
              <p className="text-lg opacity-90 mb-3">{content.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                {!isEpisode && <span className="bg-red-600 px-3 py-1 rounded">{content.releaseYear}</span>}
                <span>{content.duration} min</span>
                <span>⭐ {content.rating || (series?.rating) || 'N/A'}/5</span>
                <span>{Array.isArray(content.genres || series?.genres) ? (content.genres || series.genres).join(' • ') : (content.genres || series?.genres)}</span>
              </div>
              
              {/* Episode Navigation */}
              {isEpisode && getNextEpisode() && (
                <div className="mt-4">
                  <button
                    onClick={() => handleEpisodeSelect(getNextEpisode())}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    ▶ Next: {getNextEpisode().title}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default VideoPlayer;
