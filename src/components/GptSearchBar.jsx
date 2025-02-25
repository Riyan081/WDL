import lang from "../assets/languageConstants";
import { useSelector } from "react-redux";


const GptSearchBar = () => {
  const langKey  = useSelector((store)=>store.config.lang);
  return (
    <div className="pt-20 flex justify-center items-center">
      <form className="w-full max-w-2xl bg-black p-6 rounded-lg shadow-lg grid grid-cols-12 gap-4">
        <input
          type="text"
          className="p-4 col-span-9 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          type="submit"
          className="py-2 px-4 bg-red-700 text-white rounded-lg col-span-3 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;