const VideoTitle = ({ title, overview }) => {
    return (
        <div className="w-full h-full pt-55 px-28 absolute bg-gradient-to-r from-black bg-opacity-70 z-10 overflow-hidden">
            <h1 className="text-6xl text-amber-50 font-bold">{title}</h1>
            <p className="py-6 text-lg text-white w-1/3">{overview}</p>
            <div className="">
                <button className="bg-white bg-opacity-90 text-black p-3 px-12 text-lg rounded-lg hover:opacity-50">Play</button>
                <button className="bg-gray-500 bg-opacity-50 text-white p-3 px-12 text-lg rounded-lg mx-3">More Info</button>
            </div>
        </div>
    );
};

export default VideoTitle;