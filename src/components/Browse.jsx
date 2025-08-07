import { useEffect, useState } from "react";
import { moviesAPI, seriesAPI } from "../services/api";
import GptSearch from "./GptSearch";
import Header from "./Header";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import { useSelector, useDispatch } from "react-redux";
import { addNowPlayingMovies, addPopularMovies, addTopRatedMovies, addTrendingMovies } from "../assets/movieSlice";

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load movies from backend
      const moviesResponse = await moviesAPI.getAllMovies();
      const seriesResponse = await seriesAPI.getAllSeries();
      
      console.log('🎬 Movies response:', moviesResponse);
      console.log('📺 Series response:', seriesResponse);
      console.log('📺 Series data structure:', seriesResponse.data);
      
      // Extract the movies array from the response
      const movies = moviesResponse.data?.movies || moviesResponse.data || [];
      const seriesData = seriesResponse.data?.series || seriesResponse.data || [];
      
      console.log('📺 Extracted series data:', seriesData);
      console.log('📺 Series count:', seriesData.length);
      
      // Categorize movies by genre for different sections
      const actionMovies = movies.filter(movie => 
        Array.isArray(movie.genres) && movie.genres.some(genre => 
          genre.toLowerCase().includes('action') || genre.toLowerCase().includes('adventure')
        )
      );
      
      const comedyMovies = movies.filter(movie => 
        Array.isArray(movie.genres) && movie.genres.some(genre => 
          genre.toLowerCase().includes('comedy')
        )
      );
      
      const dramaMovies = movies.filter(movie => 
        Array.isArray(movie.genres) && movie.genres.some(genre => 
          genre.toLowerCase().includes('drama')
        )
      );
      
      const sciFiMovies = movies.filter(movie => 
        Array.isArray(movie.genres) && movie.genres.some(genre => 
          genre.toLowerCase().includes('sci-fi') || genre.toLowerCase().includes('fantasy')
        )
      );
      
      // Dispatch different categories to Redux store
      dispatch(addNowPlayingMovies(actionMovies.length > 0 ? actionMovies : movies.slice(0, 10)));
      dispatch(addPopularMovies(comedyMovies.length > 0 ? comedyMovies : movies.slice(2, 12)));
      dispatch(addTopRatedMovies(dramaMovies.length > 0 ? dramaMovies : movies.slice(4, 14)));
      dispatch(addTrendingMovies(sciFiMovies.length > 0 ? sciFiMovies : movies.slice(6, 16)));
      
      setSeries(seriesData);
      
    } catch (error) {
      console.error('Failed to load content:', error);
      // Set empty arrays on error to prevent crashes
      dispatch(addNowPlayingMovies([]));
      dispatch(addPopularMovies([]));
      dispatch(addTopRatedMovies([]));
      dispatch(addTrendingMovies([]));
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
          <SecondaryContainer series={series} />
        </>
      )}
    </div>
  );
};

export default Browse;
