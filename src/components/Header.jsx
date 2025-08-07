/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { LOGO, SUPPORTED_LANGUAGES } from "../assets/constants";
import { removeUser } from "../assets/userSlice";
import { toggleGptSearchView } from "../assets/gptSlice";
import { changeLanguage } from "../assets/configSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleSignOut = () => {
    // Clear token and user data
    localStorage.removeItem('netflix_token');
    localStorage.removeItem('netflix_user');
    dispatch(removeUser());
    navigate("/");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  // Check if user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem('netflix_token');
    if (!token && window.location.pathname !== '/') {
      navigate('/');
    }
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute top-0 left-0 w-full px-8 py-4 bg-gradient-to-b from-black to-transparent flex justify-between items-center z-20">
      <img className="w-32" src={LOGO} alt="logo" />

      {user && (
        <div className="flex items-center space-x-4">
          {showGptSearch && (
            <select className="text-amber-50 p-2 bg-gray-900" onChange={handleLanguageChange}>
              {SUPPORTED_LANGUAGES.map((lang) => 
                <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>
              )}
            </select>
          )}

          <button
            className="py-2 px-8 m-3 mx-4 bg-purple-600 text-amber-50 rounded-lg"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "Home" : "GPT"}
          </button>

          {/* User Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                className="w-10 h-10 rounded"
                src={user?.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=dc2626&color=ffffff"}
                alt="Profile"
              />
              <svg 
                className={`w-4 h-4 text-white transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Netflix-style Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-14 bg-black bg-opacity-90 backdrop-blur-sm border border-gray-600 rounded-md shadow-2xl py-2 w-56 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-8 h-8 rounded"
                      src={user?.photoURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=dc2626&color=ffffff"}
                      alt="Profile"
                    />
                    <div>
                      <p className="text-white font-medium text-sm">{user?.name}</p>
                      <p className="text-gray-400 text-xs">{user?.email}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        user?.role === 'ADMIN' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-600 text-gray-200'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      <span>Admin Panel</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      navigate('/browse');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>Home</span>
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    disabled
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="opacity-50">My List (Coming Soon)</span>
                  </button>

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    disabled
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="opacity-50">Account Settings</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-600 pt-1">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-red-900 transition-colors flex items-center space-x-2 group"
                  >
                    <svg className="w-4 h-4 group-hover:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span className="group-hover:text-red-400">Sign Out of Netflix</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
