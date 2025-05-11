import axios from '@/config/axiosConfig';


export const getAllProblemsRequest = async () => {
  try {
    const response = await axios.get('/problems/get-all-problems');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
