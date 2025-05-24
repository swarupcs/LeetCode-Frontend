import axios from '@/config/axiosConfig';

export const getIndividualSheetDetailsRequest = async (sheetId) => {
  try {
    const response = await axios.get(`/sheets/${sheetId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}
