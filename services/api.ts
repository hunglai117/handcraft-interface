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

    return Promise.reject(handleError(error));
  }
);

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

function handleError(error: AxiosError): Error {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data }: any = error.response;
    if (data.message) {
      if (Array.isArray(data.message)) {
        return new Error(data.message[0]);
      }
      return new Error(data.message);
    }
    return new Error('An error occurred with the request.');
  } else if (error.request) {
    // The request was made but no response was received
    return new Error('No response received from the server. Please check your internet connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    return new Error(error.message || 'An unexpected error occurred.');
  }
}

export async function request<T>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<any> = await api.request({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
}

export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  console.log('get', url, params);
  return request<T>('GET', url, undefined, { ...config, params });
};

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  request<T>('POST', url, data, config);

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  request<T>('PUT', url, data, config);

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  request<T>('PATCH', url, data, config);

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => request<T>('DELETE', url, {}, config);

export default api;
