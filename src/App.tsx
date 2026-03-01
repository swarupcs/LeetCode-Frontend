// ─── src/App.tsx ──────────────────────────────────────────────────────────────

import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/app/store';
import GoogleCallback from './Pages/GoogleCallback';
import Index from './Pages/Index';
import ProblemsPage from './Pages/Problems';
import ProblemDetailPage from './Pages/ProblemDetail';
import LoginPage from './Pages/Login';
import SignupPage from './Pages/Signup';
import LeaderboardPage from './Pages/Leaderboard';
import SheetsPage from './Pages/Sheets';
import SheetDetail from './Pages/SheetDetail';
import RoadmapsPage from './Pages/Roadmaps';
import RoadmapDetailPage from './Pages/RoadmapDetail';
import DiscussionsPage from './Pages/Discussions';
import DiscussionDetail from './Pages/DiscussionDetail';
import DashboardPage from './Pages/Dashboard';
import ProfilePage from './Pages/Profile';
import SettingsPage from './Pages/Settings';
import AdminDashboard from './Pages/AdminDashboard';
import AdminProblemsPage from './Pages/AdminProblems';
import CreateProblemPage from './Pages/CreateProblem';
import AdminSheetsPage from './Pages/AdminSheets';
import CreateSheetPage from './Pages/CreateSheet';
import AdminRoadmapsPage from './Pages/AdminRoadmaps';
import CreateRoadmapPage from './Pages/CreateRoadmap';
import AdminUsersPage from './Pages/AdminUsers';
import AdminUserDetailPage from './Pages/AdminUserDetail';
import NotFound from './Pages/NotFound';

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
          {/* ── Public routes ── */}
          <Route path='/' element={<Index />} />
          <Route path='/problems' element={<ProblemsPage />} />
          <Route path='/problem/:id' element={<ProblemDetailPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
          <Route path='/sheets' element={<SheetsPage />} />
          <Route path='/sheets/:id' element={<SheetDetail />} />
          <Route path='/roadmaps' element={<RoadmapsPage />} />
          <Route path='/roadmaps/:slug' element={<RoadmapDetailPage />} />
          <Route path='/discussions' element={<DiscussionsPage />} />
          <Route path='/discussions/:id' element={<DiscussionDetail />} />

          <Route path='/auth/google/callback' element={<GoogleCallback />} />

          {/* ── Public with guest fallback UI (no redirect) ── */}
          <Route path='/dashboard' element={<DashboardPage />} />

          {/* ── Protected: must be logged in ── */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Protected: must be ADMIN ── */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path='problems' element={<AdminProblemsPage />} />
            <Route path='problems/create' element={<CreateProblemPage />} />
            <Route path='problems/edit/:id' element={<CreateProblemPage />} />
            <Route path='sheets' element={<AdminSheetsPage />} />
            <Route path='sheets/create' element={<CreateSheetPage />} />
            <Route path='sheets/edit/:id' element={<CreateSheetPage />} />
            <Route path='roadmaps' element={<AdminRoadmapsPage />} />
            <Route path='roadmaps/create' element={<CreateRoadmapPage />} />
            <Route path='roadmaps/edit/:id' element={<CreateRoadmapPage />} />
            <Route path='users' element={<AdminUsersPage />} />
            <Route path='users/:id' element={<AdminUserDetailPage />} />
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
