/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import MovieCard from "./MovieCard";
import VideoPlayer from "./VideoPlayer";

const MovieList = ({ title, movies, isSeries = false }) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -800, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 800, behavior: 'smooth' });
  };

  // Debug logging
  console.log(`🎬 MovieList "${title}":`, {
    isSeries,
    moviesCount: movies?.length || 0,
    firstItem: movies?.[0]
  });

  const handlePlayContent = (content) => {
    console.log('🎮 Playing content:', content.title, 'isSeries:', isSeries);
    console.log('🎮 Content data:', content);
    setSelectedContent(content);
    setShowPlayer(true);
    console.log('🎮 Player state set to true');
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedContent(null);
  };

  // Ensure movies is an array
  const contentList = Array.isArray(movies) ? movies : [];

  if (contentList.length === 0) {
    return (
      <div className="px-6 text-white">
        <h1 className='text-2xl py-4 font-bold'>{title}</h1>
        <div className="text-gray-400">No {isSeries ? 'series' : 'movies'} available</div>
      </div>
    );
  }

  return (
    <div className="px-6 text-white mb-8 relative">
      <h1 className='text-3xl py-6 font-bold text-white'>{title}</h1>
      
      <div className="relative group">
        {/* Left Scroll Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Right Scroll Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Movie Cards Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {contentList.map((content) => (
            <div key={content.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
              <MovieCard 
                movie={content} 
                isSeries={isSeries}
                onPlay={handlePlayContent}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedContent && (
        <VideoPlayer 
          key={selectedContent?.id}
          movie={!isSeries ? selectedContent : null}
          series={isSeries ? selectedContent : null}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default MovieList;
