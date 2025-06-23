import axios from 'axios';

// const url = 'http://54.151.250.143:8080/';
const url = 'http://localhost:8080/';

export const API_ENDPOINTS = {
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id) => `/students/${id}`
  }
};

// Tạo instance axios
const api = axios.create({
    baseURL: url,
    timeout: 10000, // 10 giây
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Thêm token vào header
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Xử lý lỗi chung
        if (error.response) {
            // Lỗi từ phía server (ngoài 2xx)
            const message = error.response.data?.message || error.message;
            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Không nhận được phản hồi từ server
            return Promise.reject(new Error('Không thể kết nối đến server'));
        } else {
            // Lỗi khi thiết lập request
            return Promise.reject(error);
        }
    }
);

export default api;
