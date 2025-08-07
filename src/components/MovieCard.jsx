import React, { useState } from 'react'
import { userAPI } from '../services/api'

const MovieCard = ({ movie, onPlay, isSeries = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = () => {
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

  const handleAddToFavorites = async () => {
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
    <div 
      className="w-48 pr-4 relative group cursor-pointer transition-transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
    >
      <img 
        alt="Movie Card"
        src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
        className="object-cover h-72 w-full rounded-lg pointer-events-none" 
      />
      
      {/* Play Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors mb-3"
          >
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToFavorites();
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            ❤️ Add to Favorites
          </button>
        </div>
      )}
      
      {/* Content Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 rounded-b-lg">
        <h3 className="text-white text-sm font-semibold truncate">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-300 text-xs">{movie.releaseYear}</p>
          {isSeries && movie.totalSeasons && (
            <span className="text-red-400 text-xs">📺 {movie.totalSeasons} Season{movie.totalSeasons > 1 ? 's' : ''}</span>
          )}
        </div>
        {movie.rating && (
          <div className="flex items-center mt-1">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-white text-xs ml-1">{movie.rating}</span>
          </div>
        )}
        {!isSeries && movie.duration && (
          <p className="text-gray-400 text-xs mt-1">{movie.duration} min</p>
        )}
        {isSeries && movie.status && (
          <p className="text-gray-400 text-xs mt-1 capitalize">{movie.status.toLowerCase()}</p>
        )}
      </div>
    </div>
  )
}

export default MovieCard