import axios from '@/config/axiosConfig';


export const getUserHeatMapDataRequest = async () => {
  try {
    const response = await axios.get('/userStats/getUserHeatMapData');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}