import axios from '@/config/axiosConfig';

export const getAllSheetDetailsRequest = async (userId = null) => {
  try {
    const response = await axios.post('/sheets', {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};