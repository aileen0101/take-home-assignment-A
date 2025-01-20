//API Integration: Define functions to communicate with backend! 

// src/api/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Backend API URL

export const getFormData = async () => {
  const response = await axios.get(`${API_URL}/form-data`);
  return response.data;
};

export const createQuery = async (queryData: { title: string; description: string; formDataId: string }) => {
  const response = await axios.post(`${API_URL}/queries`, queryData);
  return response.data;
};

export const updateQueryStatus = async (queryId: string, statusData: { status: string }) => {
  const response = await axios.patch(`${API_URL}/queries/${queryId}`, statusData);
  return response.data;
};

export const deleteQuery = async (queryId: string) => {
  const response = await axios.delete(`${API_URL}/queries/${queryId}`);
  return response.data;
};

  
