import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import AuthRoutes from './routes/AppRoutes';
import AuthInitializer from './components/AuthInitializer';
import NotificationInitializer from './components/NotificationInitializer';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer>
          <NotificationInitializer>
            <AuthRoutes />
          </NotificationInitializer>
        </AuthInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
