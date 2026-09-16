import axios from 'axios';

// Use environment variable for API URL (defaults to localhost for development)
const API_URL = import.meta.env.VITE_API_URL || 'https://syncscreen-multi-window-media-sequencer.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWindows = () => api.get('/windows');
export const getMedia = () => api.get('/media');
export const createMedia = (data) => api.post('/media', data);
export const assignToPlaylist = (data) => api.post('/playlist/add', data);
export const triggerSync = (mediaId, duration) => api.post('/sync', { mediaId: parseInt(mediaId), duration: parseInt(duration) });

export default api;
