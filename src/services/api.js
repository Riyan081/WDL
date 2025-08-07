// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('netflix_token');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Movies API
export const moviesAPI = {
  getAllMovies: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/movies?${searchParams}`);
  },
  
  getMovieById: (id) => apiRequest(`/movies/${id}`),
  
  getPopularMovies: (limit = 20) => apiRequest(`/movies/popular?limit=${limit}`),
  
  getMoviesByGenre: (genre, limit = 20) => apiRequest(`/movies/genre/${genre}?limit=${limit}`),
  
  createMovie: (movieData) => apiRequest('/movies', {
    method: 'POST',
    body: JSON.stringify(movieData),
  }),
  
  updateMovie: (id, movieData) => apiRequest(`/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData),
  }),
  
  deleteMovie: (id) => apiRequest(`/movies/${id}`, {
    method: 'DELETE',
  }),
};

// Series API
export const seriesAPI = {
  getAllSeries: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/series?${searchParams}`);
  },
  
  getSeriesById: (id) => apiRequest(`/series/${id}`),
  
  createSeries: (seriesData) => apiRequest('/series', {
    method: 'POST',
    body: JSON.stringify(seriesData),
  }),
  
  updateSeries: (id, seriesData) => apiRequest(`/series/${id}`, {
    method: 'PUT',
    body: JSON.stringify(seriesData),
  }),
  
  deleteSeries: (id) => apiRequest(`/series/${id}`, {
    method: 'DELETE',
  }),
  
  addSeason: (seriesId, seasonData) => apiRequest(`/series/${seriesId}/seasons`, {
    method: 'POST',
    body: JSON.stringify(seasonData),
  }),
  
  addEpisode: (seasonId, episodeData) => apiRequest(`/series/seasons/${seasonId}/episodes`, {
    method: 'POST',
    body: JSON.stringify(episodeData),
  }),
};

// User API
export const userAPI = {
  addToFavorites: (contentData) => apiRequest('/user/favorites', {
    method: 'POST',
    body: JSON.stringify(contentData),
  }),
  
  removeFromFavorites: (id) => apiRequest(`/user/favorites/${id}`, {
    method: 'DELETE',
  }),
  
  getFavorites: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/user/favorites?${searchParams}`);
  },
  
  updateWatchHistory: (historyData) => apiRequest('/user/watch-history', {
    method: 'POST',
    body: JSON.stringify(historyData),
  }),
  
  getWatchHistory: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/user/watch-history?${searchParams}`);
  },
  
  addReview: (reviewData) => apiRequest('/user/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => apiRequest('/admin/dashboard'),
  
  getAllUsers: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/admin/users?${searchParams}`);
  },
  
  updateUserStatus: (id, statusData) => apiRequest(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  }),
  
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, {
    method: 'DELETE',
  }),
  
  getContentStats: (type = 'movies') => apiRequest(`/admin/content-stats?type=${type}`),
};

// Video Player API (for streaming)
export const videoAPI = {
  getVideoUrl: (contentId, contentType = 'movie') => {
    // This would typically return a signed URL or streaming endpoint
    return `${API_BASE_URL}/stream/${contentType}/${contentId}`;
  },
  
  updateProgress: (contentId, progress, contentType = 'movie') => {
    return userAPI.updateWatchHistory({
      contentType: contentType.toUpperCase(),
      ...(contentType === 'movie' ? { movieId: contentId } : { seriesId: contentId }),
      progress,
      completed: false
    });
  },
};
