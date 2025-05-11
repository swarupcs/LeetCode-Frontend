
import { Signup } from '@/components/Auth/Signup';
import React from 'react';

export const SignupPage = () => {
  return (
    <div className='flex min-h-svh w-full items-center justify-center md:p-10'>
      <div className='w-full max-w-sm'>
        <Signup/>
      </div>
    </div>
  );
};
