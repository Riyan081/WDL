import React, { useState, useEffect, useRef } from 'react';
import { userAPI, seriesAPI } from '../services/api';
import VideoPlayer from './VideoPlayer';

const MovieDetailView = ({ content, onClose, isSeries = false }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const modalRef = useRef(null);

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

  useEffect(() => {
    // Load episodes for series
    const loadEpisodes = async () => {
      if (isSeries && content?.id) {
        setLoading(true);
        try {
          const response = await seriesAPI.getSeriesEpisodes(content.id);
          if (response.success && response.data) {
            setEpisodes(response.data);
          }
        } catch (error) {
          console.error('Failed to load episodes:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEpisodes();

    // Handle escape key
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [content, isSeries, onClose]);

  const handlePlay = (episode = null) => {
    if (isSeries && episode) {
      setShowPlayer(true);
    } else if (content) {
      setShowPlayer(true);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await userAPI.addToFavorites({
        contentType: isSeries ? 'SERIES' : 'MOVIE',
        movieId: isSeries ? undefined : content.id,
        seriesId: isSeries ? content.id : undefined
      });
      setIsFavorite(true);
      // Show success notification
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!content) return null;

  // Filter episodes by selected season
  const seasonEpisodes = episodes.filter(ep => 
    ep.season?.seasonNumber === selectedSeason
  );

  return (
    <>
      <div 
        ref={modalRef}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        onClick={handleBackgroundClick}
      >
        <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-60 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col h-full overflow-y-auto">
            {/* Hero Section */}
            <div className="relative h-96 bg-gradient-to-t from-gray-900 to-transparent">
              {/* Background Image/Video */}
              {youtubeVideoId ? (
                <div className="absolute inset-0">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeVideoId}`}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={content.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
              ) : content.backdrop ? (
                <>
                  <img 
                    src={content.backdrop} 
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-900 to-gray-900" />
              )}

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end space-x-6">
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img 
                      src={content.poster || 'https://via.placeholder.com/300x450?text=No+Image'} 
                      alt={content.title}
                      className="w-48 h-72 object-cover rounded-lg shadow-2xl"
                    />
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 text-white">
                    <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
                    
                    {/* Content Metadata */}
                    <div className="flex items-center space-x-6 mb-4 text-lg">
                      <span className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">
                        {content.rating ? `⭐ ${content.rating}` : 'NEW'}
                      </span>
                      <span className="text-green-400 font-semibold">
                        {content.releaseYear}
                      </span>
                      {!isSeries && content.duration && (
                        <span>{content.duration} min</span>
                      )}
                      {isSeries && content.totalSeasons && (
                        <span>{content.totalSeasons} Season{content.totalSeasons > 1 ? 's' : ''}</span>
                      )}
                      <span className="border border-gray-400 px-2 py-1 text-xs">HD</span>
                    </div>

                    {/* Genres */}
                    {content.genres && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(content.genres) ? content.genres : [content.genres]).map((genre, index) => (
                          <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 mb-6">
                      <button
                        onClick={() => handlePlay()}
                        className="bg-white text-black px-8 py-3 rounded font-bold text-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>Play</span>
                      </button>

                      <button
                        onClick={handleAddToFavorites}
                        className="bg-gray-600 bg-opacity-80 text-white p-3 rounded hover:bg-opacity-100 transition-colors"
                        title="Add to My List"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>

                      <button className="bg-gray-600 bg-opacity-80 text-white p-3 rounded hover:bg-opacity-100 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </button>
                    </div>

                    {/* Description Preview */}
                    <p className="text-lg leading-relaxed text-gray-300 max-w-3xl">
                      {content.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-8 space-y-8">
              {/* Cast and Crew */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {content.cast && (
                    <div className="mb-6">
                      <h3 className="text-white text-xl font-semibold mb-3">Cast</h3>
                      <p className="text-gray-300">
                        {Array.isArray(content.cast) ? content.cast.join(', ') : content.cast}
                      </p>
                    </div>
                  )}
                  
                  {content.director && (
                    <div>
                      <h3 className="text-white text-xl font-semibold mb-3">Director</h3>
                      <p className="text-gray-300">{content.director}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Genres:</span>
                    <span className="text-white text-right">
                      {Array.isArray(content.genres) ? content.genres.join(', ') : content.genres}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Release Year:</span>
                    <span className="text-white">{content.releaseYear}</span>
                  </div>
                  {!isSeries && content.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runtime:</span>
                      <span className="text-white">{content.duration} minutes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Episodes Section for Series */}
              {isSeries && episodes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-2xl font-semibold">Episodes</h3>
                    {content.totalSeasons > 1 && (
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {Array.from({ length: content.totalSeasons }, (_, i) => i + 1).map(season => (
                          <option key={season} value={season}>Season {season}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-4">
                    {seasonEpisodes.map((episode, index) => (
                      <div key={episode.id} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-white font-bold">
                          {episode.episodeNumber}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-semibold text-lg">{episode.title}</h4>
                              <p className="text-gray-400 text-sm">{episode.duration} min</p>
                            </div>
                            <button
                              onClick={() => handlePlay(episode)}
                              className="opacity-0 group-hover:opacity-100 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-all"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-gray-300 mt-2 text-sm leading-relaxed">{episode.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      {showPlayer && (
        <VideoPlayer
          movie={!isSeries ? content : null}
          series={isSeries ? content : null}
          episode={isSeries ? seasonEpisodes[0] : null}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
};

export default MovieDetailView;
