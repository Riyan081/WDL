import { useSelector } from "react-redux";
import MovieList from "./MovieList";

const SecondaryContainer = ({ series = [] }) => {
    const movies = useSelector(store => store?.movies);
    
    console.log('📺 SecondaryContainer - Series data:', series);
    console.log('📺 Series length:', series.length);
    console.log('📺 First series:', series[0]);
    
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
                <MovieList title={"🔥 Now Playing"} movies={movies.nowPlayingMovies} />
                <MovieList title={"📺 Popular Series"} movies={series.slice(0, 10)} isSeries={true} />
                <MovieList title={"⭐ Top Rated"} movies={movies.topRatedMovies || movies.nowPlayingMovies.slice(0, 8)} />
                <MovieList title={"📈 Trending"} movies={movies.trendingMovies || movies.nowPlayingMovies.slice(2, 10)} />
                <MovieList title={"😄 Comedy"} movies={movies.popularMovies || movies.nowPlayingMovies.slice(1, 9)} />
                <MovieList title={"🚀 Sci-Fi & Fantasy"} movies={movies.trendingMovies || movies.nowPlayingMovies.slice(3, 11)} />
                <MovieList title={"🎭 Drama"} movies={movies.topRatedMovies || movies.nowPlayingMovies.slice(4, 12)} />
            </div>
        </div>
    );
};

export default SecondaryContainer;