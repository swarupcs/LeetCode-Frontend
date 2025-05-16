import axios from '@/config/axiosConfig';

export const runCode = async ({
  source_code,
  language_id,
  stdin,
  expected_outputs,
  problemId,
}) => {
  try {
    const response = await axios.post('/execute-code', {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
