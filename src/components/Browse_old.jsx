import { useEffect, useState } from "react";
import { moviesAPI, seriesAPI } from "../services/api";
import GptSearch from "./GptSearch";
import Header from "./Header";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import { useSelector, useDispatch } from "react-redux";
import { addNowPlayingMovies, addPopularMovies } from "../assets/movieSlice";

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load movies from backend
      const moviesResponse = await moviesAPI.getAllMovies();
      const seriesResponse = await seriesAPI.getAllSeries();
      
      console.log('Movies response:', moviesResponse);
      console.log('Series response:', seriesResponse);
      
      // Extract the movies array from the response
      const movies = moviesResponse.data?.movies || moviesResponse.data || [];
      const series = seriesResponse.data?.series || seriesResponse.data || [];
      
      // Dispatch movies to Redux store
      dispatch(addNowPlayingMovies(movies));
      dispatch(addPopularMovies(movies));
      
    } catch (error) {
      console.error('Failed to load content:', error);
      // Set empty arrays on error to prevent crashes
      dispatch(addNowPlayingMovies([]));
      dispatch(addPopularMovies([]));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Netflix...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {showGptSearch ? (
        <GptSearch />
      ) : (
        <>
          <MainContainer />
          <SecondaryContainer />
        </>
      )}
    </div>
  );
};

export default Browse;
