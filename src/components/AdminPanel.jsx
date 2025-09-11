import { useState, useEffect } from 'react';
import { adminAPI, moviesAPI, seriesAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const user = useSelector(store => store.user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [addType, setAddType] = useState('movie'); // 'movie' or 'series'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    releaseYear: '',
    genres: '',
    director: '',
    cast: '',
    poster: '',
    backdrop: '',
    trailerUrl: '',
    rating: ''
  });

  const [episodeFormData, setEpisodeFormData] = useState({
    seriesId: '',
    seasonNumber: 1,
    episodeNumber: 1,
    title: '',
    description: '',
    duration: '',
    videoUrl: '',
    thumbnail: ''
  });

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/browse" replace />;
  }

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'movies') {
      loadMovies();
    } else if (activeTab === 'series') {
      loadSeries();
    } else if (activeTab === 'episodes') {
      loadSeries(); // Load series for episode management
      loadEpisodes();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getAllMovies();
      // Handle different response structures
      const moviesData = response.data?.movies || response.data || [];
      setMovies(Array.isArray(moviesData) ? moviesData : []);
    } catch (error) {
      console.error('Failed to load movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSeries = async () => {
    try {
      setLoading(true);
      const response = await seriesAPI.getAllSeries();
      // Handle different response structures
      const seriesData = response.data?.series || response.data || [];
      setSeries(Array.isArray(seriesData) ? seriesData : []);
    } catch (error) {
      console.error('Failed to load series:', error);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEpisodes = async () => {
    try {
      const response = await adminAPI.getAllEpisodes();
      setEpisodes(response.data || []);
    } catch (error) {
      console.error('Failed to load episodes:', error);
      setEpisodes([]);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        loadUsers(); // Refresh list
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await moviesAPI.deleteMovie(movieId);
        loadMovies(); // Refresh list
      } catch (error) {
        console.error('Failed to delete movie:', error);
      }
    }
  };

  const handleDeleteSeries = async (seriesId) => {
    if (window.confirm('Are you sure you want to delete this series?')) {
      try {
        await seriesAPI.deleteSeries(seriesId);
        loadSeries(); // Refresh list
      } catch (error) {
        console.error('Failed to delete series:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      releaseYear: '',
      genres: '',
      director: '',
      cast: '',
      poster: '',
      backdrop: '',
      trailerUrl: '',
      rating: ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data based on type
      const submitData = {
        ...formData,
        duration: addType === 'movie' ? parseInt(formData.duration) : undefined,
        releaseYear: parseInt(formData.releaseYear),
        genres: formData.genres.split(',').map(g => g.trim()),
        cast: formData.cast.split(',').map(c => c.trim()),
        rating: parseFloat(formData.rating) || 0,
        status: 'PUBLISHED'
      };

      if (addType === 'movie') {
        await moviesAPI.createMovie(submitData);
        loadMovies();
      } else {
        await seriesAPI.createSeries(submitData);
        loadSeries();
      }

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error(`Failed to create ${addType}:`, error);
      alert(`Failed to create ${addType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEpisodeInputChange = (e) => {
    const { name, value } = e.target;
    setEpisodeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEpisode = async () => {
    try {
      setLoading(true);
      
      if (editingEpisode) {
        // Update existing episode
        await adminAPI.updateEpisode(editingEpisode.id, {
          title: episodeFormData.title,
          description: episodeFormData.description,
          duration: parseInt(episodeFormData.duration),
          videoUrl: episodeFormData.videoUrl,
          thumbnail: episodeFormData.thumbnail
        });
        alert('Episode updated successfully!');
      } else {
        // Add new episode
        // First, ensure the season exists
        const seasonResponse = await adminAPI.createSeason(episodeFormData.seriesId, {
          seasonNumber: parseInt(episodeFormData.seasonNumber),
          title: `Season ${episodeFormData.seasonNumber}`,
          description: `Season ${episodeFormData.seasonNumber}`
        });

        const seasonId = seasonResponse.data?.id;

        if (!seasonId) {
          throw new Error('Failed to create or find season');
        }

        // Create the episode
        await adminAPI.createEpisode({
          seasonId,
          episodeNumber: parseInt(episodeFormData.episodeNumber),
          title: episodeFormData.title,
          description: episodeFormData.description,
          duration: parseInt(episodeFormData.duration),
          videoUrl: episodeFormData.videoUrl,
          thumbnail: episodeFormData.thumbnail
        });
        alert('Episode added successfully!');
      }

      setShowEpisodeModal(false);
      setEditingEpisode(null);
      setEpisodeFormData({
        seriesId: '',
        seasonNumber: 1,
        episodeNumber: 1,
        title: '',
        description: '',
        duration: '',
        videoUrl: '',
        thumbnail: ''
      });
      loadEpisodes();
    } catch (error) {
      console.error('Save episode error:', error);
      alert('Failed to save episode: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (loading) return <div className="text-white text-center">Loading...</div>;
    if (!dashboardStats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-400">{dashboardStats.stats.totalUsers}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">Total Movies</h3>
          <p className="text-3xl font-bold text-green-400">{dashboardStats.stats.totalMovies}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">Total Series</h3>
          <p className="text-3xl font-bold text-purple-400">{dashboardStats.stats.totalSeries}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">Total Episodes</h3>
          <p className="text-3xl font-bold text-orange-400">{dashboardStats.stats.totalEpisodes}</p>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    if (loading) return <div className="text-white text-center">Loading...</div>;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'ADMIN' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'ACTIVE' ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                      disabled={user.role === 'ADMIN'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMovies = () => {
    if (loading) return <div className="text-white text-center">Loading...</div>;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Movie Management</h3>
          <button
            onClick={() => {
              setAddType('movie');
              setShowAddModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Add Movie
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.id} className="bg-gray-700 rounded-lg p-4">
                <div className="aspect-[2/3] bg-gray-600 rounded mb-3 overflow-hidden">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{movie.title}</h4>
                <p className="text-gray-400 text-xs mb-2">{movie.releaseYear}</p>
                <p className="text-yellow-400 text-xs mb-3">★ {movie.rating || 'N/A'}</p>
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs w-full"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No movies found. Click "Add Movie" to create your first movie.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSeries = () => {
    if (loading) return <div className="text-white text-center">Loading...</div>;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Series Management</h3>
          <button
            onClick={() => {
              setAddType('series');
              setShowAddModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Add Series
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(series) && series.length > 0 ? (
            series.map((show) => (
              <div key={show.id} className="bg-gray-700 rounded-lg p-4">
                <div className="aspect-[2/3] bg-gray-600 rounded mb-3 overflow-hidden">
                  {show.poster ? (
                    <img src={show.poster} alt={show.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{show.title}</h4>
                <p className="text-gray-400 text-xs mb-2">{show.releaseYear} • {show.totalSeasons} Seasons</p>
                <p className="text-yellow-400 text-xs mb-3">★ {show.rating || 'N/A'}</p>
                <button
                  onClick={() => handleDeleteSeries(show.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs w-full"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No series found. Click "Add Series" to create your first series.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEpisodes = () => {
    if (loading) return <div className="text-white text-center">Loading...</div>;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Episode Management</h3>
          <button
            onClick={() => setShowEpisodeModal(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Add Episode
          </button>
        </div>
        
        {/* Episodes List */}
        <div className="grid grid-cols-1 gap-4">
          {Array.isArray(episodes) && episodes.length > 0 ? (
            episodes.map((episode) => (
              <div key={episode.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-12 bg-gray-600 rounded overflow-hidden">
                    {episode.thumbnail ? (
                      <img src={episode.thumbnail} alt={episode.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{episode.title}</h4>
                    <p className="text-gray-400 text-xs">
                      {episode.season?.series?.title} - S{episode.season?.seasonNumber}E{episode.episodeNumber}
                    </p>
                    <p className="text-gray-400 text-xs">{episode.duration} min</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEpisode(episode)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEpisode(episode.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No episodes found. Click "Add Episode" to create your first episode.
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleDeleteEpisode = async (episodeId) => {
    if (window.confirm('Are you sure you want to delete this episode?')) {
      try {
        await adminAPI.deleteEpisode(episodeId);
        alert('Episode deleted successfully!');
        loadEpisodes();
      } catch (error) {
        console.error('Failed to delete episode:', error);
        alert('Failed to delete episode');
      }
    }
  };

  const handleEditEpisode = (episode) => {
    setEditingEpisode(episode);
    setEpisodeFormData({
      seriesId: episode.season?.seriesId || '',
      seasonNumber: episode.season?.seasonNumber || 1,
      episodeNumber: episode.episodeNumber,
      title: episode.title,
      description: episode.description,
      duration: episode.duration.toString(),
      videoUrl: episode.videoUrl || '',
      thumbnail: episode.thumbnail || ''
    });
    setShowEpisodeModal(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">Netflix Admin Panel</h1>
          <div className="text-white">
            Welcome, {user.name} ({user.role})
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900 p-4">
        <div className="flex space-x-4">
          {['dashboard', 'users', 'movies', 'series', 'episodes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded capitalize ${
                activeTab === tab
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'movies' && renderMovies()}
        {activeTab === 'series' && renderSeries()}
        {activeTab === 'episodes' && renderEpisodes()}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Add {addType === 'movie' ? 'Movie' : 'Series'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-bold mb-2">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {addType === 'movie' && (
                  <div>
                    <label className="block text-white text-sm font-bold mb-2">Duration (minutes)*</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                      required={addType === 'movie'}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-white text-sm font-bold mb-2">Release Year*</label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Genres (comma-separated)*</label>
                <input
                  type="text"
                  name="genres"
                  value={formData.genres}
                  onChange={handleInputChange}
                  placeholder="Action, Drama, Thriller"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Director</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Cast (comma-separated)</label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleInputChange}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Poster URL</label>
                <input
                  type="url"
                  name="poster"
                  value={formData.poster}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Backdrop URL</label>
                <input
                  type="url"
                  name="backdrop"
                  value={formData.backdrop}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Trailer URL</label>
                <input
                  type="url"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-white font-bold"
                >
                  {loading ? 'Creating...' : `Create ${addType === 'movie' ? 'Movie' : 'Series'}`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Episode Modal */}
      {showEpisodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingEpisode ? 'Edit Episode' : 'Add Episode'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveEpisode();
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white text-sm font-bold mb-2">Series*</label>
                  <select
                    name="seriesId"
                    value={episodeFormData.seriesId}
                    onChange={handleEpisodeInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Series</option>
                    {series.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-bold mb-2">Season Number*</label>
                  <input
                    type="number"
                    name="seasonNumber"
                    value={episodeFormData.seasonNumber}
                    onChange={handleEpisodeInputChange}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-bold mb-2">Episode Number*</label>
                  <input
                    type="number"
                    name="episodeNumber"
                    value={episodeFormData.episodeNumber}
                    onChange={handleEpisodeInputChange}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-bold mb-2">Duration (minutes)*</label>
                  <input
                    type="number"
                    name="duration"
                    value={episodeFormData.duration}
                    onChange={handleEpisodeInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">Episode Title*</label>
                <input
                  type="text"
                  name="title"
                  value={episodeFormData.title}
                  onChange={handleEpisodeInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">Description*</label>
                <textarea
                  name="description"
                  value={episodeFormData.description}
                  onChange={handleEpisodeInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">Video URL (YouTube ID)</label>
                <input
                  type="text"
                  name="videoUrl"
                  value={episodeFormData.videoUrl}
                  onChange={handleEpisodeInputChange}
                  placeholder="e.g., dQw4w9WgXcQ"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={episodeFormData.thumbnail}
                  onChange={handleEpisodeInputChange}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-white font-bold"
                >
                  {loading ? (editingEpisode ? 'Updating...' : 'Creating...') : (editingEpisode ? 'Update Episode' : 'Create Episode')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEpisodeModal(false);
                    setEditingEpisode(null);
                    setEpisodeFormData({
                      seriesId: '',
                      seasonNumber: 1,
                      episodeNumber: 1,
                      title: '',
                      description: '',
                      duration: '',
                      videoUrl: '',
                      thumbnail: ''
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
