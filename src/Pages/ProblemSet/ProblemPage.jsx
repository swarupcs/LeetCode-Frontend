import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AllProblem from '@/components/ProblemSet/AllProblem';
import { toast } from 'sonner';
import axios from '@/config/axiosConfig';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';

export const ProblemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const getMe = async () => {
    try {
      const response = await axios.get('/auth/me');

      // dispatch(
      //   loginSuccess({
      //     user: response.user.name,
      //     role: response.user.role,
      //     id: response.user.id,
      //     isAuthenticated: true,
      //   })
      // );

      console.log("response", response.data);
      dispatch(
        loginSuccess({
          user: response.data.name,
          role: response.data.role,
          id: response.data.id,
          isAuthenticated: true,
        })
      );
      return response.data;

    } catch (error) {
      console.error(error);
      throw error.response?.data || error;
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');

    if (success === 'google_login') {
      // Call getMe() after successful login
      getMe()
        .then((user) => {
          console.log('User data:', user);
          // You can update your app state here with user data
          setTimeout(() => {
            toast.success('Successfully logged in with Google!');
          }, 50);
        })
        .catch((error) => {
          console.error('Failed to get user data:', error);
          setTimeout(() => {
            toast.error('Login successful but failed to get user data.');
          }, 50);
        })
        .finally(() => {
          navigate('/problem-set', { replace: true });
        });
    } else if (success === 'google_login_failed') {
      setTimeout(() => {
        toast.error('Google login failed.');
      }, 50);
      navigate('/problem-set', { replace: true });
    }
  }, [location.search, navigate]);

  return <AllProblem />;
};
