import axios from 'axios';
import Cookies from './cookies';
import Config from '@/utils/config';
const baseURL = Config.api;

class Http {
    constructor() {
        this.axiosInstance = axios.create({ baseURL });
        this.axiosInstance.interceptors.request.use((config) => {
            const tokenCookie = Cookies.get('token');
            if (tokenCookie && tokenCookie.id) {
                config.headers.Authorization = `Bearer ${tokenCookie.id}`;
            }
            return config;
        });
    }
    getInstance() {
        return this.axiosInstance;
    }
}

const http = new Http();

export default http.getInstance();
