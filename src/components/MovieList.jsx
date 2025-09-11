/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import MovieCard from "./MovieCard";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";

const MovieList = ({ title, movies, isSeries = false }) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

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
    <div className="px-6 text-white">
      <h1 className='text-2xl py-4 font-bold'>{title}</h1>
      <div className="flex overflow-x-scroll scrollbar-hide space-x-4 pb-4">
        {contentList.map((content) => (
          <MovieCard 
            key={content.id} 
            movie={content} 
            isSeries={isSeries}
            onPlay={handlePlayContent}
          />
        ))}
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedContent && (
        <>
          {console.log('🎬 Rendering EnhancedVideoPlayer:', { 
            showPlayer, 
            selectedContent: selectedContent?.title, 
            isSeries 
          })}
          <EnhancedVideoPlayer 
            key={selectedContent?.id} // Force remount when content changes
            movie={!isSeries ? selectedContent : null}
            series={isSeries ? selectedContent : null}
            onClose={handleClosePlayer}
          />
        </>
      )}
    </div>
  );
};

export default MovieList;
