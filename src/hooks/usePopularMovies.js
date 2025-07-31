
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addPopularMovies } from '../assets/movieSlice';
import { API_OPTIONS } from '../assets/constants';





const usePopularMovies = () => {


    
        //fetch data from tbddb api and update stores
            const dispatch = useDispatch();
        
          const getPopularMovies = async ()=>{
          try {
            const data = await fetch('https://api.themoviedb.org/3/movie/popular?page=1', API_OPTIONS);
            if (!data.ok) throw new Error('API request failed');
            const json = await data.json();
            console.log("Popular Movies:", json.results);
            dispatch(addPopularMovies(json.results));
          } catch (error) {
            console.error("Error fetching popular movies:", error);
            // Set dummy data if API fails
            const dummyMovies = [
              {
                id: 13,
                original_title: "Wednesday",
                overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends at Nevermore Academy.",
                poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
                backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg"
              },
              {
                id: 14,
                original_title: "Elite",
                overview: "When three working-class teens enroll in an exclusive private school in Spain, the clash between them and the wealthy students leads to murder.",
                poster_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
                backdrop_path: "/3UBQGKS7YaEOpoYEIvHN9dOYqCg.jpg"
              },
              {
                id: 15,
                original_title: "The Umbrella Academy",
                overview: "A dysfunctional family of superheroes comes together to solve the mystery of their father's death.",
                poster_path: "/tRS6jvPM9qPrrnx2KRp3ew96Yot.jpg",
                backdrop_path: "/uYHdIs7zBLfOu8LGCVbNjNrLvr7.jpg"
              },
              {
                id: 16,
                original_title: "Lupin",
                overview: "Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
                poster_path: "/sgxzT54GnvgAQB0WKSJPh3SdwRM.jpg",
                backdrop_path: "/dJNbSr4SUWnQSPJ7lnhIQzREQyJ.jpg"
              },
              {
                id: 17,
                original_title: "You",
                overview: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by.",
                poster_path: "/lkKg6zOwt05LLNhxAhJjYOZWOL9.jpg",
                backdrop_path: "/cqJ9TEj7F4w3Rkfj0WPMn7w6QoC.jpg"
              },
              {
                id: 18,
                original_title: "Sex Education",
                overview: "A teenage boy with a sex therapist mother teams up with a high school classmate to set up an underground sex therapy clinic at school.",
                poster_path: "/8j12tohv1NBZv6WpYj2DkfBnsA0.jpg",
                backdrop_path: "/klC1BWuOwSMGwkpxd1ESw1ZYMT4.jpg"
              },
              {
                id: 19,
                original_title: "The Good Place",
                overview: "A woman struggles to be a good person when she is sent to The Good Place, a heaven-like utopia, by mistake.",
                poster_path: "/qIhsuhoIjD5aga5ZgqoVPP7SFpp.jpg",
                backdrop_path: "/eAA0n6rrn6bMGIlq4LMGSCZGUHl.jpg"
              },
              {
                id: 20,
                original_title: "Orange Is the New Black",
                overview: "A privileged New Yorker ends up in a women's prison when a past crime catches up with her.",
                poster_path: "/Lv6Z7FtOHm6Z5bWaDbYfzRsseO.jpg",
                backdrop_path: "/lAaZZNi8F7nRdJL2kXLy4jWnc5L.jpg"
              },
              {
                id: 21,
                original_title: "Peaky Blinders",
                overview: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps.",
                poster_path: "/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
                backdrop_path: "/i3vOOlHTNePaadyv8eSu96CnIGu.jpg"
              },
              {
                id: 22,
                original_title: "Breaking Bad",
                overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
                poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
                backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg"
              }
            ];
            dispatch(addPopularMovies(dummyMovies));
          }
          }
        
          useEffect(()=>{
        getPopularMovies();
          },[]);
        



}

export default usePopularMovies;