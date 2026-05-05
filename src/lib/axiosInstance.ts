import axios from 'axios';

// Base URLs
export const testApiBaseURL = 'https://fc3thch8-3000.inc1.devtunnels.ms/';
export const productionApiBaseURL = 'https://data-collection-for-esston-deployment.onrender.com/';

// Axios instances
export const testApi = axios.create({
  baseURL: testApiBaseURL,
});

export const productionApi = axios.create({
  baseURL: productionApiBaseURL,
});
