import { useSelector } from "react-redux";
import MovieList from "./MovieList";

const SecondaryContainer = () => {
    const movies = useSelector(store => store?.movies);
    
    // Show loading state if no movies are loaded yet
    if (!movies?.nowPlayingMovies || movies.nowPlayingMovies.length === 0) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading movies...</div>
            </div>
        );
    }

    return (
        <div className="bg-black">
            <div className="secondary-container pl-12 -mt-30 relative z-30">
                <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
                <MovieList title={"Trending"} movies={movies.nowPlayingMovies} />
                <MovieList title={"Popular"} movies={movies.popularMovies || movies.nowPlayingMovies} />
                <MovieList title={"Recently Added"} movies={movies.nowPlayingMovies} />
                <MovieList title={"Top Rated"} movies={movies.nowPlayingMovies} />
            </div>
        </div>
    );
};

export default SecondaryContainer;