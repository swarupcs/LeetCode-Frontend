import axios from '@/config/axiosConfig';

export const deleteSheetRequest = async (sheetId) => {
  try {
    const response = await axios.delete(`/sheets/${sheetId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}