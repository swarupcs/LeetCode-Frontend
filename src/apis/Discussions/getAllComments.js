import axios from '@/config/axiosConfig';

export const getAllCommentsRequest = async (discussionId) => {
  try {
    const response = await axios.get(
      `/discussions/getAllComments${discussionId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
