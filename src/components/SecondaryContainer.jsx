import { useSelector } from "react-redux";
import MovieList from "./MovieList";
const SecondaryContainer = () => {
    const movies = useSelector(store=>store?.movies);
    

    return (
        movies.nowPlayingMovies &&
        (
 <div className=" bg-black">
    <div className="secondary-container pl-12 -mt-30 relative z-30">
     <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
     <MovieList title={"Trending"} movies={movies.nowPlayingMovies} />
     <MovieList title={"Populer"} movies={movies.popularMovies} />
     <MovieList title={"Upcoming"} movies={movies.nowPlayingMovies} />
     <MovieList title={"Upcoming"} movies={movies.nowPlayingMovies} />
     </div>
        </div>)
    );




}

export default SecondaryContainer;