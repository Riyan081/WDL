/* eslint-disable no-unused-vars */
import { signOut } from 'firebase/auth';
import { auth } from '../assets/firebase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { LOGO } from '../assets/constants';
import { addUser, removeUser } from '../assets/userSlice';


const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(store=>store.user);
    
    const handleSignOut = () => {

        signOut(auth)
        .then(() => {
            // Sign-out successful.
           

          })
          .catch((error) => {
            // An error happened.
            navigate("/error")
          });
    }

    useEffect(()=>{//we want this code to be present all time on website and header will alway be there
       const unsubscribe =  onAuthStateChanged(auth, (user) => {  //used when thre is any update in login and all process
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              const {uid,email,displayName,photoURL} = user;
              dispatch(addUser({uid:uid,email: email,displayName: displayName, photoURL: photoURL}));
              navigate('/browse');
            } else {
              // User is signed out
              // ...
              dispatch(removeUser());
                navigate('/');
            }
          });
        //Unsubscribe when component unmounts 
          return () => unsubscribe();
    },[])

  
    return (
        <div className="absolute top-0 left-0 w-full px-8 py-4 bg-gradient-to-b from-black to-transparent flex justify-between items-center">
            <img className="w-32" src={LOGO} alt="logo" />
          
          { user && (<div className="flex items-center space-x-4">
                <img className="w-10 h-10 rounded-full" src={user?.photoURL} alt="avatar" />
                <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded">(Sign Out)</button>
            </div>)}
        </div>
    );
}

export default Header;