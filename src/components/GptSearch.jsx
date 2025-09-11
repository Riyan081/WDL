import GptSearchBar from './GptSearchBar';
import GptMovieSuggestions from './GptMovieSuggestions';

const GptSearch = () => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-netflix">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/638e9299-0637-42d1-ba39-54ade4cf2bf6/web/IN-en-20250203-TRIFECTA-perspective_46eb8857-face-4ea6-b901-dbf22b461369_large.jpg"
          alt="background"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <GptSearchBar />
        <GptMovieSuggestions />
      </div>
    </div>
  );
};

export default GptSearch;