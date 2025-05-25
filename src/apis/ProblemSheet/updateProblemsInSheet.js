import axios from '@/config/axiosConfig';


export const updateProblemsInSheetRequest = async ({ sheetId, problemIds }) => {
  try {
    const response = await axios.post(`/sheets/${sheetId}/updateProblems`, {
      problemIds
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response?.data || error;
  }
}