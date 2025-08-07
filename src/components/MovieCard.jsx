import React, { useState } from 'react'
import { userAPI } from '../services/api'

const MovieCard = ({ movie, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = () => {
    if (onPlay && movie) {
      // Track watch history
      userAPI.updateWatchHistory({
        contentType: 'MOVIE',
        movieId: movie.id,
        progress: 0,
        completed: false
      }).catch(console.error);
      
      onPlay(movie);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await userAPI.addToFavorites({
        contentType: 'MOVIE',
        movieId: movie.id
      });
      alert('Added to favorites!');
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  return (
    <div 
      className="w-48 pr-4 relative group cursor-pointer transition-transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        alt="Movie Card"
        src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
        className="object-cover h-72 w-full rounded-lg" 
      />
      
      {/* Play Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-lg">
          <button
            onClick={handlePlayClick}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors mb-3"
          >
            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={handleAddToFavorites}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            ❤️ Add to Favorites
          </button>
        </div>
      )}
      
      {/* Movie Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 rounded-b-lg">
        <h3 className="text-white text-sm font-semibold truncate">{movie.title}</h3>
        <p className="text-gray-300 text-xs">{movie.releaseYear}</p>
        {movie.rating && (
          <div className="flex items-center mt-1">
            <span className="text-yellow-400 text-xs">⭐</span>
            <span className="text-white text-xs ml-1">{movie.rating}</span>
          </div>
        )}
        <p className="text-gray-400 text-xs mt-1">{movie.duration} min</p>
      </div>
    </div>
  )
}

export default MovieCard