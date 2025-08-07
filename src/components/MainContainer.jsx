import {useSelector} from 'react-redux';
import VideoBackground from './VideoBackground';
import VideoTitle from './VideoTitle';

const MainContainer = () =>{
 const movies = useSelector(store=>store?.movies?.nowPlayingMovies);
 if(!movies) return (
   <div className="w-full h-screen bg-black flex items-center justify-center">
     <div className="text-white text-2xl">Loading...</div>
   </div>
 );
 const mainMovie = movies?.[0];
 if(!mainMovie) return null;
//console.log(mainMovie);

// Handle both backend data structure (title, description) and TMDB structure (original_title, overview)
const title = mainMovie.title || mainMovie.original_title;
const overview = mainMovie.description || mainMovie.overview;
const id = mainMovie.id;

    return (
        <div>
          <VideoTitle title={title} overview={overview} movie={mainMovie}/>
            <VideoBackground movieId={id}/>
        </div>
    )
}

export default MainContainer;