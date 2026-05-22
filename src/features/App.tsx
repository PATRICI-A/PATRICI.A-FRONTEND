import { RouterProvider } from 'react-router';
import { router } from '../routes';
import { AppProvider } from '../store/AppContext';
import { NotificationProvider } from '../store/NotificationContext';
import { PageHeaderProvider } from '../store/PageHeaderContext';
import { AppBackground } from '../components/ui/AppBackground';
import { ToastNotification } from '../components/ui/ToastNotification';
export default function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <PageHeaderProvider>
          <AppBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <RouterProvider router={router} />
          </div>
          <ToastNotification />
        </PageHeaderProvider>
      </NotificationProvider>
    </AppProvider>
  );
}