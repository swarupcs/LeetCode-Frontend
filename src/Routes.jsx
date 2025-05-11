import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import { Notfound } from './Pages/Notfound/NotFound';
import { Login } from './Pages/Auth/Login';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<div>Signup</div>} />
      <Route path='/*' element={<Notfound />} />
    </Routes>
  );
};
