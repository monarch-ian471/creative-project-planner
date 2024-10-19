import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from './cookies';
import Config from '@/utils/config';

const baseURL = Config.api;

interface TokenCookie {
    id?: string;
}

class Http {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({ baseURL });
        this.initializeRequestInterceptor();
    }

    private initializeRequestInterceptor() {
        this.axiosInstance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
            const tokenCookie: TokenCookie = Cookies.get('token');
            if (tokenCookie && tokenCookie.id) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${tokenCookie.id}`;
            }
            return config;
            },
            (error) => {
            return Promise.reject(error);
            }
        );
    }

    public getInstance(): AxiosInstance {
        return this.axiosInstance;
    }
}

const http = new Http();

export default http.getInstance();
