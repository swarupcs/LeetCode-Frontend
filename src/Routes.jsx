import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import { Notfound } from './Pages/Notfound/NotFound';

import { Header } from './components/LandingPage/Header';
import { SignupPage } from './Pages/Auth/SignupPage';
import { LoginPage } from './Pages/Auth/LoginPage';
import { ProblemPage } from './Pages/ProblemSet/ProblemPage';

import { PrivateRoute, PublicRoute } from './lib/ProtectedRote/ProtectedRoute';
import { ProfilePage } from './Pages/Profile/ProfilePage';
import { IndividualProblemPage } from './Pages/IndividualProblem/IndividualProblemPage';
import { UpdateProblemPage } from './Pages/ProblemForm/UpdateProblemPage';
import { CreateProblemPage } from './Pages/ProblemForm/CreateProblemPage';
import { ProblemFormPage } from './Pages/ProblemForm/ProblemFormPage';
import { ProblemSheetPage } from './Pages/ProblemSheet/ProblemSheetPage';
import Navbar from './components/ProblemSet/NavBar';
import IndividualProblemSheetDetails from './components/ProblemSheet/IndividualProblemSheetDetails';
// Layout component that includes the Header for all pages
const Layout = ({ children }) => {
  return (
    <div className='flex min-h-screen flex-col bg-premium-darker text-white'>
      <Header />
      {children}
    </div>
  );
};

const NavLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;


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
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          </Layout>
        }
      />
      <Route
        path='/signup'
        element={
          <Layout>
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          </Layout>
        }
      />
      <Route
        path='/problem-set'
        element={
          <Layout>
            <NavLayout>
              <ProblemPage />
            </NavLayout>
          </Layout>
        }
      />
      <Route
        path='/dsaSheet'
        element={
          <Layout>
            <NavLayout>
              <ProblemSheetPage />
            </NavLayout>
          </Layout>
        }
      />
      <Route
        path='/dsaSheet/:sheetId'
        element={
          <Layout>
            <IndividualProblemSheetDetails />
          </Layout>
        }
      />

      {/* <Route
        path='/dsaSheet/:sheetId'
        element={           <IndividualProblemSheetDetails />
        }
      /> */}
      <Route
        path='/create-problem'
        element={
          <Layout>
            <PrivateRoute>
              <ProblemFormPage mode='create' />
            </PrivateRoute>
          </Layout>
        }
      />
      {/*  */}
      <Route
        path='/edit-problem/:id'
        element={
          <Layout>
            <PrivateRoute>
              <ProblemFormPage mode='update' />
            </PrivateRoute>
          </Layout>
        }
      />

      <Route
        path='/profile'
        element={
          <Layout>
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          </Layout>
        }
      />
      <Route
        path='/problems/:problemId'
        element={
          <Layout>
            <IndividualProblemPage />
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
