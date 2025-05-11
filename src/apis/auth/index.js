import axios from '@/config/axiosConfig';
import { loginSuccess } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';

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



// Action to store user data in Redux after successful login or signup
export const handleLoginSuccess = (data, dispatch) => {
  dispatch(loginSuccess({
    user: data.user,  // User data (name, email, etc.)
    role: data.role,  // User role (admin or user)
  }));
};