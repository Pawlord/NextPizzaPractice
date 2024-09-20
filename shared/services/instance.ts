import axios from 'axios';

//Настройка экземпляра аксиоса
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})