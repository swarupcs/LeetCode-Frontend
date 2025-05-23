import axios from '@/config/axiosConfig';


export const getAllProblemsRequest = async (userId = null) => {
  try {
    const response = await axios.post('/problems/get-all-problems', {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
