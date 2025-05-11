import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './Routes';
import { Toaster } from '@/components/ui/sonner';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './app/store';
function App() {
  const queryClient = new QueryClient();

  // Add this to verify the store and persistor are correctly initialized
  console.log('Store initialized:', store);
  console.log('Persistor initialized:', persistor);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster position='top-center' richColors />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App
