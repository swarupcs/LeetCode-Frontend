import axios from '@/config/axiosConfig';

export const updateCommentRequest = async (discussionId) => {
  try {
    const response = await axios.put(
      `/discussions/updateComment/${discussionId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
