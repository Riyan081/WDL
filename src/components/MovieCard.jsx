import React, { useState } from 'react'
import { userAPI } from '../services/api'
import MovieDetailView from './MovieDetailView'

const MovieCard = ({ movie, onPlay, isSeries = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleCardClick = () => {
    console.log('🎬 Card clicked for:', movie.title, 'isSeries:', isSeries);
    setShowDetailView(true);
  };

  const handlePlayClick = (e) => {
    e?.stopPropagation();
    console.log('🎬 Play clicked for:', movie.title, 'isSeries:', isSeries);
    if (onPlay && movie) {
      // Track watch history
      userAPI.updateWatchHistory({
        contentType: isSeries ? 'SERIES' : 'MOVIE',
        movieId: isSeries ? undefined : movie.id,
        seriesId: isSeries ? movie.id : undefined,
        progress: 0,
        completed: false
      }).catch(console.error);
      
      onPlay(movie);
    } else {
      console.error('🚨 onPlay function or movie data missing:', { onPlay: !!onPlay, movie: !!movie });
    }
  };

  const handleAddToFavorites = async (e) => {
    e?.stopPropagation();
    try {
      await userAPI.addToFavorites({
        contentType: isSeries ? 'SERIES' : 'MOVIE',
        movieId: isSeries ? undefined : movie.id,
        seriesId: isSeries ? movie.id : undefined
      });
      alert(`Added to favorites!`);
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  return (
    <>
      <div 
        className="w-48 pr-4 relative group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="relative overflow-hidden rounded-lg">
          <img 
            alt="Movie Card"
            src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
            className="object-cover h-72 w-full transition-all duration-300" 
          />
          
          {/* Hover Overlay with Netflix-like styling */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Quick Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2">
              <button
                onClick={handleAddToFavorites}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                title="Add to My List"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              <button
                onClick={handlePlayClick}
                className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-all duration-200 transform hover:scale-110"
                title="Play"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Content Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white text-sm font-bold mb-1 line-clamp-1">{movie.title}</h3>
              
              {/* Metadata */}
              <div className="flex items-center space-x-2 mb-2 text-xs">
                {movie.rating && (
                  <span className="bg-red-600 px-2 py-0.5 rounded text-white font-semibold">
                    ⭐ {movie.rating}
                  </span>
                )}
                <span className="text-gray-300">{movie.releaseYear}</span>
                {!isSeries && movie.duration && (
                  <span className="text-gray-300">{movie.duration}m</span>
                )}
                {isSeries && movie.totalSeasons && (
                  <span className="text-red-400 font-semibold">
                    {movie.totalSeasons} Season{movie.totalSeasons > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              {/* Genres */}
              {movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 2).map((genre, index) => (
                    <span key={index} className="text-gray-300 text-xs bg-gray-700 px-2 py-0.5 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              
              {/* More Info Button */}
              <button 
                className="mt-2 text-white text-xs hover:underline focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailView(true);
                }}
              >
                More info ↗
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie Detail View */}
      {showDetailView && (
        <MovieDetailView
          content={movie}
          onClose={() => setShowDetailView(false)}
          isSeries={isSeries}
        />
      )}
    </>
  )
}

export default MovieCard