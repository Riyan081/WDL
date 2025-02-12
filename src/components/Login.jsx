import Header from './Header';

const Login = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <img className="absolute top-0 left-0 w-full h-full object-cover" src="https://assets.nflxext.com/ffe/siteui/vlv3/638e9299-0637-42d1-ba39-54ade4cf2bf6/web/IN-en-20250203-TRIFECTA-perspective_46eb8857-face-4ea6-b901-dbf22b461369_large.jpg" alt="background" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black"></div>
            <div className="relative z-10">
                <Header />
            </div>
            <div className="relative z-10 left-135 top-20 ">
                <form className="pt-8 pl-18 bg-black rounded w-110 h-140"  style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} >
                    <h2 className="text-amber-50 text-3xl font-bold mb-7">Sign In</h2>
                    <input type="text" placeholder="Email Address" className="p-4 mb-4 w-80 bg-amber-50 text-black rounded" />
                    <input type="password" placeholder="Password" className="p-4 mb-4 w-80 bg-amber-50 text-black rounded" />
                    <button className="p-3 w-80 bg-red-600 text-white rounded">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default Login;