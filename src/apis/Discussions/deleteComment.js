import axios from '@/config/axiosConfig';

export const deleteCommentRequest = async (id) => {
  try {
    console.log('discussionId', id);
    const response = await axios.delete(`/discussions/deleteComment/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
