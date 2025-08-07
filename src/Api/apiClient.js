import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://mon-projet.test/api', // Your API base URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
       
    }
});

// Add a request interceptor to include the token in every request
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Or wherever you store your token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;