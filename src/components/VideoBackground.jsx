/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { API_OPTIONS } from "../assets/constants";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { addTrailerVideo } from "../assets/movieSlice";
import { useDispatch } from "react-redux";

const VideoBackground = ({ movieId }) => {
   const trailer = useSelector((store)=>store.movies.trailerVideo);
   const movies = useSelector((store)=>store.movies.nowPlayingMovies);

    const dispatch = useDispatch();
  
  const getMovieVideos = async () => {
    try {
      // First check if we have a backend movie with trailerUrl
      const currentMovie = movies?.find(movie => movie.id === movieId);
      
      if (currentMovie?.trailerUrl) {
        // Extract YouTube video ID from URL
        let videoId = null;
        if (currentMovie.trailerUrl.includes('youtube.com/watch?v=')) {
          videoId = currentMovie.trailerUrl.split('v=')[1]?.split('&')[0];
        } else if (currentMovie.trailerUrl.includes('youtu.be/')) {
          videoId = currentMovie.trailerUrl.split('youtu.be/')[1]?.split('?')[0];
        }
        
        if (videoId) {
          dispatch(addTrailerVideo({ key: videoId }));
          return;
        }
      }
      
      // Fallback to TMDB API for dummy data
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        API_OPTIONS
      );
      if (!data.ok) throw new Error('API request failed');
      const json = await data.json();
      console.log(json);
      const filterData = json.results?.filter((video) => video.type === "Trailer");
      const trailer = filterData?.[0];
      console.log(trailer);
      dispatch(addTrailerVideo(trailer));
    } catch (error) {
      console.error("Error fetching movie videos:", error);
      // Set Stranger Things trailer when API fails to load
      dispatch(addTrailerVideo({ key: "b9EkMc79ZSU" })); // Official Stranger Things Season 4 Trailer
    }
  };

  useEffect(() => {
    getMovieVideos();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {trailer?.key ? (
        <iframe
          className="w-full h-full scale-125"
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&start=0&end=120&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          frameBorder="0"
        ></iframe>
      ) : (
        <div className="w-full h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Loading Trailer...</h1>
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
