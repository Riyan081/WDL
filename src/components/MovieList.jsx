/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import MovieCard from "./MovieCard";
import VideoPlayer from "./VideoPlayer";

const MovieList = ({ title, movies }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlayMovie = (movie) => {
    setSelectedMovie(movie);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedMovie(null);
  };

  // Ensure movies is an array
  const movieList = Array.isArray(movies) ? movies : [];

  if (movieList.length === 0) {
    return (
      <div className="px-6 text-white">
        <h1 className='text-3xl py-4 font-bold'>{title}</h1>
        <div className="text-gray-400">No movies available</div>
      </div>
    );
  }

  return (
    <div className="px-6 text-white">
      <h1 className='text-3xl py-4 font-bold'>{title}</h1>
      <div className="flex overflow-x-scroll scrollbar-hide space-x-4 pb-4">
        {movieList.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onPlay={handlePlayMovie}
          />
        ))}
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedMovie && (
        <VideoPlayer 
          movie={selectedMovie}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default MovieList;
