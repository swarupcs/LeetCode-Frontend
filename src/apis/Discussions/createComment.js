import axios from '@/config/axiosConfig';

export const createCommentRequest = async (post) => {
  try {
    const response = await axios.post('/discussions/createComment', post);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
