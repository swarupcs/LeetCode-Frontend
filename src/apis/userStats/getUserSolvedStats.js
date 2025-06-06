import axios from '@/config/axiosConfig';


export const getUSerSolvedStatsRequest = async () => {
  try {
    const response = await axios.get('/userStats/getUserSolvedStats');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}