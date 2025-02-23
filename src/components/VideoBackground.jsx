/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { API_OPTIONS } from "../assets/constants";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { addTrailerVideo } from "../assets/movieSlice";
import { useDispatch } from "react-redux";

const VideoBackground = ({ movieId }) => {
   const trailer = useSelector((store)=>store.movies.trailerVideo);

    const dispatch = useDispatch();
  const getMovieVideos = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/950396/videos?language=en-US",
      API_OPTIONS
    );
    const json = await data.json();
   // console.log(json);
    const filterData = json.results.filter((video) => video.type === "Trailer");
    const trailer = filterData[0];
   // console.log(trailer);
    dispatch(addTrailerVideo(trailer));

  };

  useEffect(() => {
    getMovieVideos();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <iframe
        className="w-full h-full"
        src={"https://www.youtube.com/embed/" + trailer?.key + "?autoplay=1&mute=1&controls=0&loop=1&playlist=" + trailer?.key}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        
      ></iframe>
    </div>
  );
};

export default VideoBackground;
