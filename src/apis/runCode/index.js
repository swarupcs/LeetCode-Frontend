import axios from '@/config/axiosConfig';

export const runCode = async ({
  source_code,
  language_id,
  problemId,
}) => {
  try {
    const response = await axios.post('codeExecutor/runCode', {
      source_code,
      language_id,
      problemId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
