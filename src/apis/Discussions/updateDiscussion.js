import axios from '@/config/axiosConfig';


export const updateDiscussionRequest = async (discussionId) => {
  try {
    const response = await axios.put(`/discussions/updateDiscussion/${discussionId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}