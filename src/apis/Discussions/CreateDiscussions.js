import axios from '@/config/axiosConfig';


export const createDiscussionRequest = async (post) => {
  try {
    const response = await axios.post('/discussions/createDiscussion', post);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}