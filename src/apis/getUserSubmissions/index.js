import axios from '@/config/axiosConfig';

export const getUserAllSubmissions = async () => {
  try {
    const response = await axios.get('/submission/getUserSubmissions');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
