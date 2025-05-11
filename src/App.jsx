import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './Routes';
import { Toaster } from '@/components/ui/sonner';
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster position='top-center' richColors />
    </QueryClientProvider>
  );
}

export default App
