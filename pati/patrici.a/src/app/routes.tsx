import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { ParchesPage } from './pages/ParchesPage';
import { CreateParchePage } from './pages/CreateParchePage';
import { ParchemDetailPage } from './pages/ParchemDetailPage';
import { ChatListPage } from './pages/ChatListPage';
import { ChatPage } from './pages/ChatPage';
import { DirectChatPage } from './pages/DirectChatPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MonasAlbumPage } from './pages/MonasAlbumPage';
import { StatsPage } from './pages/StatsPage';
import { WellnessPage } from './pages/WellnessPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { CampusMapPage } from './pages/CampusMapPage';
import { RankingPage } from './pages/RankingPage';
import { MatchesPage } from './pages/MatchesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function NotFound() {
  return <Navigate to="/home" replace />;
}

export const router = createBrowserRouter([
  // Public pages (no layout)
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/forgot-password', Component: ForgotPasswordPage },

  // Admin pages
  { path: '/admin/login', Component: AdminLoginPage },
  { path: '/admin/dashboard', Component: AdminDashboardPage },

  // Full-screen pages (their own header, no app layout)
  { path: '/chat/:id', Component: ChatPage },
  { path: '/direct-chat/:id', Component: DirectChatPage },
  { path: '/parches/create', Component: CreateParchePage },
  { path: '/parches/:id', Component: ParchemDetailPage },
  { path: '/monas', Component: MonasAlbumPage },
  { path: '/stats', Component: StatsPage },
  { path: '/wellness', Component: WellnessPage },
  { path: '/bienestar', Component: WellnessPage },
  { path: '/notifications', Component: NotificationsPage },
  { path: '/settings', Component: SettingsPage },
  { path: '/edit-profile', Component: EditProfilePage },
  { path: '/campus-map', Component: CampusMapPage },
  { path: '/ranking', Component: RankingPage },
  { path: '/matches', Component: MatchesPage },
  { path: '/user/:userId', Component: UserProfilePage },

  // App pages with Layout (header + bottom nav)
  {
    path: '/',
    Component: Layout,
    children: [
      { path: 'home', Component: HomePage },
      { path: 'parches', Component: ParchesPage },
      { path: 'chat', Component: ChatListPage },
      { path: 'events', Component: EventsPage },
      { path: 'profile', Component: ProfilePage },
    ],
  },

  // Catch-all
  { path: '*', Component: NotFound },
]);