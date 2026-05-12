import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import '../styles/fonts.css';

// The doodle background is now placed INSIDE each page wrapper (z-index: 0),
// behind all content — see Layout.tsx and individual full-screen pages.
export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
