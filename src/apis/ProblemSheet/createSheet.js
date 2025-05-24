import axios from '@/config/axiosConfig';

export const createSheetRequest = async ({name, description}) => {
  try {
    const response = await axios.post('/sheets/create-sheet', {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
}