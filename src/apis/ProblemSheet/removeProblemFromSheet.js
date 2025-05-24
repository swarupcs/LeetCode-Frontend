import axios from '@/config/axiosConfig';


export const removeProblemFromSheetRequest = async ({ sheetId, problemId }) => {
  try {
    const response = await axios.delete(`/sheets/${sheetId}/removeProblem`, {
      problemIds: problemId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};