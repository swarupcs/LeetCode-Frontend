import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminLayout } from '@/components/layout/AdminLayout';
import Index from './pages/Index';
import Problems from './pages/Problems';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProblemDetail from './pages/ProblemDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import Sheets from './pages/Sheets';
import SheetDetail from './pages/SheetDetail';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetail from './pages/RoadmapDetail';
import Discussions from './pages/Discussions';
import DiscussionDetail from '@/pages/DiscussionDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminProblems from './pages/AdminProblems';
import AdminSheets from './pages/AdminSheets';
import AdminRoadmaps from './pages/AdminRoadmaps';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import CreateProblem from './pages/CreateProblem';
import CreateSheet from './pages/CreateSheet';
import CreateRoadmap from './pages/CreateRoadmap';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/app/store';

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  const isProblemDetail = location.pathname.startsWith('/problem/');
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1'>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/problems' element={<Problems />} />
          <Route path='/problem/:id' element={<ProblemDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/sheets' element={<Sheets />} />
          <Route path='/sheets/:id' element={<SheetDetail />} />
          <Route path='/roadmaps' element={<Roadmaps />} />
          <Route path='/roadmaps/:slug' element={<RoadmapDetail />} />
          <Route path='/discussions' element={<Discussions />} />
          <Route path='/discussions/:id' element={<DiscussionDetail />} />

          {/* Admin routes with shared layout */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path='problems' element={<AdminProblems />} />
            <Route path='problems/create' element={<CreateProblem />} />
            <Route path='problems/edit/:id' element={<CreateProblem />} />
            <Route path='sheets' element={<AdminSheets />} />
            <Route path='sheets/create' element={<CreateSheet />} />
            <Route path='sheets/edit/:id' element={<CreateSheet />} />
            <Route path='roadmaps' element={<AdminRoadmaps />} />
            <Route path='roadmaps/create' element={<CreateRoadmap />} />
            <Route path='roadmaps/edit/:id' element={<CreateRoadmap />} />
            <Route path='users' element={<AdminUsers />} />
            <Route path='users/:id' element={<AdminUserDetail />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      {!isProblemDetail && !isAdmin && <Footer />}
    </div>
  );
}

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark'>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
