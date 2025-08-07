import Login from './Login'
import Browse from './Browse'
import AdminPanel from './AdminPanel'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addUser } from '../assets/userSlice'

const Body = () => {
    const dispatch = useDispatch();

    // Check for existing user session on app load
    useEffect(() => {
        const token = localStorage.getItem('netflix_token');
        const userData = localStorage.getItem('netflix_user');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                dispatch(addUser(user));
            } catch (error) {
                // If user data is corrupted, clear it
                localStorage.removeItem('netflix_token');
                localStorage.removeItem('netflix_user');
            }
        }
    }, [dispatch]);
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Login/>
        },
        {
            path: "/browse",
            element: <Browse/>
        },
        {
            path: "/admin",
            element: <AdminPanel/>
        },
    ]);

    return (
        <div>
            <RouterProvider router={appRouter}/>
        </div>
    )
}

export default Body;
