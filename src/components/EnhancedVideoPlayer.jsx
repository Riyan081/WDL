import React, { useState, useEffect, useRef } from 'react';
import { videoAPI } from '../services/api';

const EnhancedVideoPlayer = ({ movie, series, episode, onClose }) => {
  console.log('🎬 EnhancedVideoPlayer rendered with:', { movie: movie?.title, series: series?.title, episode: episode?.title });
  
  const [showControls, setShowControls] = useState(true);
  const [seriesData, setSeriesData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(episode || null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Determine what content we're playing
  const content = currentEpisode || movie || series;
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
          const response = await fetch(`http://localhost:5000/api/series/${series.id}/episodes`);
          const data = await response.json();
          
          if (data.success) {
            setEpisodes(data.data);
            
            // If no current episode is set, set the first episode
            if (!currentEpisode && data.data.length > 0) {
              const firstEpisode = data.data[0];
              setCurrentEpisode(firstEpisode);
              console.log('🎬 Set first episode as current:', firstEpisode.title);
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

  const handleEpisodeSelect = (episode) => {
    setCurrentEpisode(episode);
  };

  const getNextEpisode = () => {
    if (!isEpisode || !episodes.length) return null;
    const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
    return currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
  };

  const handleCloseClick = () => {
    console.log('🎬 Close button clicked');
    if (onClose) {
      onClose();
    } else {
      console.error('❌ onClose function not provided');
    }
  };

  if (!content) {
    console.log('🚨 No content provided to EnhancedVideoPlayer:', { movie, series, episode });
    return null;
  }

  console.log('🎬 Content to play:', content);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video Section */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        {/* YouTube Video Embed */}
        {youtubeVideoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&controls=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={content.title}
          />
        ) : (
          <div className="text-center text-white p-8">
            <h2 className="text-2xl mb-4">Video Not Available</h2>
            <p className="text-gray-400 mb-4">The video for "{content.title}" is not available at the moment.</p>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
            >
              Back to Browse
            </button>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-60">
          <button
            onClick={handleCloseClick}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-2xl font-bold transition-colors shadow-lg border-2 border-white"
            title="Close Player (ESC)"
          >
            ✕
          </button>
        </div>

        <div className="absolute top-4 left-4 z-60">
          <button
            onClick={handleCloseClick}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            title="Back to Browse"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Content Details and Episodes Section */}
      <div className="bg-gray-900 text-white max-h-96 overflow-y-auto">
        {/* Content Information */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Content Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              {isEpisode && (
                <p className="text-xl text-red-400 mb-3">
                  Season {currentEpisode.season?.seasonNumber} • Episode {currentEpisode.episodeNumber} • {currentEpisode.duration} min
                </p>
              )}
              <p className="text-gray-300 mb-4">{content.description}</p>
              
              <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-400">
                {!isEpisode && (
                  <>
                    <span className="bg-red-600 text-white px-2 py-1 rounded">{content.releaseYear || series?.releaseYear}</span>
                    <span>⭐ {content.rating || series?.rating || 'N/A'}/10</span>
                    <span>{content.duration} min</span>
                  </>
                )}
                {isEpisode && (
                  <>
                    <span>⭐ {series?.rating || 'N/A'}/10</span>
                    <span>👀 {currentEpisode.viewCount || 0} views</span>
                  </>
                )}
                <span>{Array.isArray(content.genres || series?.genres) ? (content.genres || series.genres).join(', ') : (content.genres || series?.genres)}</span>
              </div>

              {/* Next Episode Button */}
              {isEpisode && getNextEpisode() && (
                <div className="mt-4">
                  <button
                    onClick={() => handleEpisodeSelect(getNextEpisode())}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <span>▶</span>
                    <span>Next: {getNextEpisode().title}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            {(content.poster || content.thumbnail || series?.poster) && (
              <div className="w-32 h-48 flex-shrink-0 mt-4 lg:mt-0">
                <img
                  src={content.poster || content.thumbnail || series?.poster}
                  alt={content.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Episodes Section - Only show for series */}
        {isSeries && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Episodes</h2>
              {episodes.length > 0 && (
                <span className="text-gray-400">{episodes.length} episodes available</span>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <p className="mt-2 text-gray-400">Loading episodes...</p>
              </div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:scale-105 ${
                      currentEpisode?.id === ep.id ? 'ring-2 ring-red-500 bg-gray-700' : ''
                    }`}
                    onClick={() => handleEpisodeSelect(ep)}
                  >
                    {/* Episode Thumbnail */}
                    <div className="relative mb-3">
                      <img
                        src={ep.thumbnail || series?.poster || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400'}
                        alt={ep.title}
                        className="w-full h-24 object-cover rounded"
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        S{ep.season?.seasonNumber}E{ep.episodeNumber}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {ep.duration}m
                      </div>
                      {currentEpisode?.id === ep.id && (
                        <div className="absolute inset-0 bg-red-600 bg-opacity-20 flex items-center justify-center rounded">
                          <div className="bg-red-600 text-white p-2 rounded-full">
                            ▶
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Episode Info */}
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{ep.title}</h3>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-3">{ep.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>👀 {ep.viewCount || 0} views</span>
                      {ep.airDate && (
                        <span>{new Date(ep.airDate).getFullYear()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No episodes available for this series.</p>
                <p className="text-sm mt-2">Episodes will be added soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
