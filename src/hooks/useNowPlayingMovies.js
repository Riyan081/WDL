
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNowPlayingMovies } from '../assets/movieSlice';
import { API_OPTIONS } from '../assets/constants';





const useNowPlayingMovies = () => {


    
        //fetch data from tbddb api and update stores
            const dispatch = useDispatch();
        
          const getNowPlayingMovies = async ()=>{
          try {
            const data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=1', API_OPTIONS);
            if (!data.ok) throw new Error('API request failed');
            const json = await data.json();
            console.log("Now Playing Movies:", json.results);
            dispatch(addNowPlayingMovies(json.results));
          } catch (error) {
            console.error("Error fetching now playing movies:", error);
            // Set dummy data if API fails
            const dummyMovies = [
              {
                id: 1,
                original_title: "Stranger Things",
                overview: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
                poster_path: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
                backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"
              },
              {
                id: 2,
                original_title: "The Witcher",
                overview: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
                poster_path: "/cZ0d3rtvXPVvuiX22sP79K3Hmjz.jpg",
                backdrop_path: "/7HtvmsLJdMPNjjgWyFkEP5MPKNh.jpg"
              },
              {
                id: 3,
                original_title: "The Crown",
                overview: "The gripping, decades-spanning inside story of Her Majesty Queen Elizabeth II and the Prime Ministers who shaped Britain's post-war destiny.",
                poster_path: "/1M876KPjulVwppEpldhdc8V4o68.jpg",
                backdrop_path: "/7Mdt3jwUDZGzxftLhfBTlLN9Y0K.jpg"
              },
              {
                id: 4,
                original_title: "Money Heist",
                overview: "To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers.",
                poster_path: "/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg",
                backdrop_path: "/mYM8x2Atv4MaLulaV0KVJWI1Djv.jpg"
              },
              {
                id: 5,
                original_title: "Dark",
                overview: "A missing child causes four families to help each other for answers. What they discover is something far more sinister.",
                poster_path: "/7IAMdVYj3WqQMF5L8b9m1L5wr2L.jpg",
                backdrop_path: "/9yxep7oJdkj3Pla9TD9gKflRApY.jpg"
              },
              {
                id: 6,
                original_title: "Ozark",
                overview: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years.",
                poster_path: "/m73QQRlIhQWQ42S9PsaD8k6oHfT.jpg",
                backdrop_path: "/kPmAiZWrCLrHGJFO1i3fgTupUdW.jpg"
              },
              {
                id: 7,
                original_title: "Narcos",
                overview: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar.",
                poster_path: "/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
                backdrop_path: "/3qwU6a0IJM0EKw7cWdN6pnOcFPT.jpg"
              },
              {
                id: 8,
                original_title: "Black Mirror",
                overview: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
                poster_path: "/mSTy6Iy4HAr7aTZSCcPzx2bOLU6.jpg",
                backdrop_path: "/reXlAZr3WtRhL6HNKKlCgQ7kBE3.jpg"
              },
              {
                id: 9,
                original_title: "House of Cards",
                overview: "A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.",
                poster_path: "/hKWxWjFwnMvkWQawbhvC0Y7ygQ9.jpg",
                backdrop_path: "/fZaVc0NP88BU1NMt8Wff66X9R5D.jpg"
              },
              {
                id: 10,
                original_title: "The Queen's Gambit",
                overview: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom.",
                poster_path: "/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg",
                backdrop_path: "/34OGjFEbHKBq3eoYfukAKyPJhZI.jpg"
              },
              {
                id: 11,
                original_title: "Bridgerton",
                overview: "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.",
                poster_path: "/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg",
                backdrop_path: "/8Ok2gFIqAKsKjtYWI0MJpA6TFDX.jpg"
              },
              {
                id: 12,
                original_title: "Squid Game",
                overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
                poster_path: "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
                backdrop_path: "/zNIjOGpzHv6BAgCU5J0XULIClM1.jpg"
              }
            ];
            dispatch(addNowPlayingMovies(dummyMovies));
          }
          }
        
          useEffect(()=>{
        getNowPlayingMovies();
          },[]);
        



}

export default useNowPlayingMovies;