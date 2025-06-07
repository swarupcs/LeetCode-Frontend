import axios from '@/config/axiosConfig';


export const deleteDiscussionRequest = async (id) => {
  try {

    console.log('discussionId', id);
    const response = await axios.delete(`/discussions/deleteDiscussion/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}