import axios from '@/config/axiosConfig';


export const getIndividualProblemsRequest = async (problemId) => {
  try {
    const response = await axios.get(`/problems/get-problem/${problemId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
