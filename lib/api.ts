import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token') || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = Cookies.get('refresh_token') || localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
          Cookies.set('access_token', data.access, { expires: 7 });
          localStorage.setItem('access_token', data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          clearAuth();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export function clearAuth() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function setTokens(access: string, refresh: string) {
  Cookies.set('access_token', access, { expires: 7 });
  Cookies.set('refresh_token', refresh, { expires: 30 });
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

// Auth endpoints
export const authApi = {
  requestOtp: (phone_number: string) =>
    api.post('/auth/request-otp/', { phone_number }),
  verifyOtp: (phone_number: string, otp: string) =>
    api.post('/auth/verify-otp/', { phone_number, otp }),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
};

// Cooperative endpoints
export const cooperativeApi = {
  list: () => api.get('/cooperatives/'),
  get: (id: number) => api.get(`/cooperatives/${id}/`),
};

// Transaction endpoints
export const transactionApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/transactions/', { params }),
  get: (id: number) => api.get(`/transactions/${id}/`),
  create: (data: Record<string, unknown>) => api.post('/transactions/', data),
  summary: (params?: Record<string, string | number>) =>
    api.get('/transactions/summary/', { params }),
  exportCsv: (params?: Record<string, string | number>) =>
    api.get('/transactions/export/', { params, responseType: 'blob' }),
  verify: (id: number) => api.get(`/transactions/${id}/verify/`),
};

// Vote endpoints
export const voteApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/votes/', { params }),
  get: (id: number) => api.get(`/votes/${id}/`),
  create: (data: Record<string, unknown>) => api.post('/votes/', data),
  cast: (id: number, in_favor: boolean) =>
    api.post(`/votes/${id}/cast/`, { in_favor }),
  close: (id: number) => api.post(`/votes/${id}/close/`),
  result: (id: number) => api.get(`/votes/${id}/result/`),
};

// Members endpoints (using cooperatives nested or accounts)
export const memberApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/cooperatives/members/', { params }),
  get: (id: number) => api.get(`/cooperatives/members/${id}/`),
  create: (data: Record<string, unknown>) =>
    api.post('/cooperatives/members/', data),
  update: (id: number, data: Record<string, unknown>) =>
    api.patch(`/cooperatives/members/${id}/`, data),
  deactivate: (id: number) =>
    api.patch(`/cooperatives/members/${id}/`, { is_active: false }),
};

// Reports endpoints
export const reportApi = {
  list: () => api.get('/reports/'),
  get: (id: number) => api.get(`/reports/${id}/`),
  generate: () => api.post('/reports/generate/'),
};
