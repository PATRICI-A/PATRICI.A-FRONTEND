import { RouterProvider } from 'react-router';
import { router } from '../routes';
import { AppProvider } from '../store/AppContext';
import { AppBackground } from '../components/ui/AppBackground';
export default function App() {
  return (
    <AppProvider>
      <AppBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <RouterProvider router={router} />
      </div>
    </AppProvider>
  );
}