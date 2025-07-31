# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Netflix Clone App - Updated July 31, 2025

## ✨ Latest Features
- ✅ Login/Signup with Firebase Authentication
- ✅ Browse Page with 20+ dummy movies
- ✅ Stranger Things trailer background
- ✅ Multi-language GPT search support
- ✅ Error handling for API failures
- ✅ Responsive design with Tailwind CSS

## 🚀 Technologies Used
- React 19 + Vite
- Redux Toolkit for state management
- Firebase for authentication
- Tailwind CSS for styling
- TMDB API for movie data

# set routing 
-  npm i -D react-router-dom

# features
-Login signup pagep
       -sign in / s/"ign up page
       -redirect to browse page
       - 
- Browse
   -Header
   -Main Movie
     -Trailer
     -Title
     -Discription
     -moviesuggestions

-Gpt
   -search bar
   -movie suggestions

-userRef hook = use to ref a field like button and ann 
   
   -redux toolkit
   npm i -D @reduxjs/toolkit
   npm i react-redux

   


   Bugfix:- Signup user display and profile pic update
   Bugfix:- if user is not logged in redirect to /browser to / login page 
   -created custom hook
   -created userSlice
   -updated store with movie data
   -updated store with user data
   -planning or main and sec container 
   


   //why api call happens 2 times because the react does extrarender to check for some inconsistency between calls 