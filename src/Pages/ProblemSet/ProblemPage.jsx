import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AllProblem from '@/components/ProblemSet/AllProblem';
import { toast } from 'sonner';

export const ProblemPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');

    if (success === 'google_login') {
      setTimeout(() => {
        toast.success('Successfully logged in with Google!');
      }, 50);
      navigate('/problem-set', { replace: true });
    } else if (success === 'google_login_failed') {
      setTimeout(() => {
        toast.error('Google login failed.');
      }, 50);
      navigate('/problem-set', { replace: true });
    }
  }, [location.search, navigate]);
  
  

  return <AllProblem />;
};
