import axios from '@/config/axiosConfig';

export const updateProblemDetails = async ({
  problemId,
  problemNumber,
  problem,
  testCases,
}) => {
  try {
    const response = await axios.put(`/problems/update-problem/${problemId}`, {
      problemNumber,
      problem,
      testCases,
    });

    return response.data;
  } catch (error) {
    console.log('error', error);
    throw error.response.data;
  }
};
