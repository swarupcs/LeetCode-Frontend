import axios from '@/config/axiosConfig';


export const addProblemToSheetRequest = async ({ sheetId, problemId }) => {
  try {
    const response = await axios.post(`/sheets/${sheetId}/addProblem`, {
      problemIds: problemId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}