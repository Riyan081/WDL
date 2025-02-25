import GptSearchBar from './GptSearchBar';
import GptMovieSuggestions from './GptMovieSuggestions';
import { useEffect } from 'react';
import { renderCanvas } from '../components/ui/canvas';

const GptSearch = () => {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src="https://assets.nflxext.com/ffe/siteui/vlv3/638e9299-0637-42d1-ba39-54ade4cf2bf6/web/IN-en-20250203-TRIFECTA-perspective_46eb8857-face-4ea6-b901-dbf22b461369_large.jpg"
        alt="background"
      />
      <GptSearchBar />
      <GptMovieSuggestions />
      <canvas
        className="pointer-events-none absolute inset-0 w-full h-full"
        id="canvas"
      ></canvas>
    </div>
  );
};

export default GptSearch;