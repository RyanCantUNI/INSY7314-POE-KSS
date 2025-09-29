import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'https://api.example.com',
  withCredentials: true // send/receive cookies
});

export default client;