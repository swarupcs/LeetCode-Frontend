import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import { Notfound } from './Pages/Notfound/NotFound';

import { Header } from './components/LandingPage/Header';
import { SignupPage } from './Pages/Auth/SignupPage';
import { LoginPage } from './Pages/Auth/LoginPage';
import { ProblemPage } from './Pages/ProblemSet/ProblemPage';
import CreateProblemPage from './components/CreateProblem/CreateProblem';

// Layout component that includes the Header for all pages
const Layout = ({ children }) => {
  return (
    <div className='flex min-h-screen flex-col bg-premium-darker text-white'>
      <Header />
      {children}
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Layout>
            <Homepage />
          </Layout>
        }
      />
      <Route
        path='/login'
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
      <Route
        path='/signup'
        element={
          <Layout>
            <SignupPage />
          </Layout>
        }
      />
      <Route
        path='/problem-set'
        element={
          <Layout>
            <ProblemPage />
          </Layout>
        }
      />
      <Route
        path='/create-problem'
        element={
          <Layout>
            <CreateProblemPage/>
          </Layout>
        }
      />
      <Route
        path='/*'
        element={
          <Layout>
            <Notfound />
          </Layout>
        }
      />
    </Routes>
  );
};
