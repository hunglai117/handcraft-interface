/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import config from '../configs';

const api = axios.create({
  baseURL: `${config.baseApiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const { response } = error;

    if (response?.status === 401) {
      Cookies.remove('token');

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    let response: AxiosResponse;

    switch (method) {
      case 'GET':
        response = await api.get(url, { ...config, params: data });
        break;
      case 'POST':
        response = await api.post(url, data, config);
        break;
      case 'PUT':
        response = await api.put(url, data, config);
        break;
      case 'DELETE':
        response = await api.delete(url, { ...config, params: data });
        break;
      case 'PATCH':
        response = await api.patch(url, data, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data?.message || error.message;
      console.error(`API Error: ${serverError}`);
      throw new Error(serverError);
    }

    throw error;
  }
}

export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig) =>
  request<T>('GET', url, params, config);

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('POST', url, data, config);

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) => request<T>('PUT', url, data, config);

export const del = <T>(url: string, params?: any, config?: AxiosRequestConfig) =>
  request<T>('DELETE', url, params, config);

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request<T>('PATCH', url, data, config);

export default api;
