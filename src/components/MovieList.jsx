/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import MovieCard from "./MovieCard";

// Updated: July 31, 2025 - Netflix Clone with working movie lists
const MovieList = ({ title, movies }) => {
  console.log(movies);
  return (
    <div className="px-2  text-white">
      <h1 className='text-3xl py-2 '>{title}</h1>
      <div className="flex overflow-x-scroll p-">
        
        <div className="flex ">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} posterPath={movie.poster_path} />
          ))}
         
        </div>
      </div>
    </div>
  );
};

export default MovieList;
