
import { Login } from '@/components/Auth/Login';
import React from 'react'

export const LoginPage = () => {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Login />
      </div>
    </div>
  );
}
