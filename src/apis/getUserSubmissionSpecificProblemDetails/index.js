import axios from '@/config/axiosConfig';

export const getUserSubmissionSpecificProblemDetails = async (problemId) => {
    if (!problemId) {
      throw new Error('Problem ID is required');
    }
    try {
    const response = await axios.get(
      `/submission/getUserSubmissionsForSpecificProblem/${problemId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
