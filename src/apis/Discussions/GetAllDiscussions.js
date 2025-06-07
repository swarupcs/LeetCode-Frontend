import axios from '@/config/axiosConfig';


export const getAllDiscussionsRequest = async () => {
  try {
    const response = await axios.get('/discussions/getAllDiscussions');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}