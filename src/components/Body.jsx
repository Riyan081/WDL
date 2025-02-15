import Login from './Login'
import Browse from './Browse'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import {  onAuthStateChanged } from "firebase/auth";
import { auth } from '../assets/firebase';
import { useDispatch } from 'react-redux';
import { addUser } from '../assets/userSlice'
import { removeUser } from '../assets/userSlice'


const Body =()=>{
    const dispatch = useDispatch();
   
    const appRouter = createBrowserRouter([
        {
            path:"/",
            element:<Login/>
        },
        {
            path:"/browse",
            element:<Browse/>
        },
        
    ]);

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {  //used when thre is any update in login and all process
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              const {uid,email,displayName} = user;
              dispatch(addUser({uid:uid,email: email,displayName: displayName}));
            
            } else {
              // User is signed out
              // ...
              dispatch(removeUser());
               

            }
          });
    },[])
  


    return(
        <div>
     <RouterProvider router={appRouter}/>
        </div>
    )
}

export default Body;
