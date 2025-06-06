import axios from '@/config/axiosConfig';


export const getUserProgressDataRequest = async () => {
  try {
    const response = await axios.get('/userStats/getUserProgress');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}