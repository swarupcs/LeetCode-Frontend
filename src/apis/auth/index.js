import axios from '@/config/axiosConfig';

export const signUpRequest = async ({ email, password, name }) => {
  try {
    const response = await axios.post('/auth/register', {
      email,
      name,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};




export const signInRequest = async ({ email, password }) => {
  try {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
  