import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './Routes';
import { Toaster } from '@/components/ui/sonner';
import { Provider } from 'react-redux';

import { store } from './app/store';
function App() {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <Toaster position='top-center' richColors />
      </QueryClientProvider>
    </Provider>
  );
}

export default App
