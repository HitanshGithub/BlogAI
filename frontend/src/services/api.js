import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me')
};

// Blog API
export const blogAPI = {
    getBlogs: (params) => api.get('/blogs', { params }),
    getBlog: (id, countView = false) => api.get(`/blogs/${id}`, { params: { view: countView ? 'true' : 'false' } }),
    createBlog: (blogData) => api.post('/blogs', blogData),
    updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
    updateNotes: (id, notes) => api.patch(`/blogs/${id}/notes`, { notes }),
    deleteBlog: (id) => api.delete(`/blogs/${id}`),
    getMyBlogs: () => api.get('/blogs/my-blogs'),
    getAllTags: () => api.get('/blogs/tags')
};

// AI API
export const aiAPI = {
    summarize: (content, title) => api.post('/ai/summarize', { content, title })
};

export default api;
