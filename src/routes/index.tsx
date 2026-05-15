import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from '../components/layout/Layout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { HomePage } from '../pages/HomePage';
import { ParchesPage } from '../pages/ParchesPage';
import { CreateParchePage } from '../pages/CreateParchePage';
import { ParchemDetailPage } from '../pages/ParchemDetailPage';
import { ChatListPage } from '../pages/ChatListPage';
import { ChatPage } from '../pages/ChatPage';
import { DirectChatPage } from '../pages/DirectChatPage';
import { EventsPage } from '../pages/EventsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { MonasAlbumPage } from '../pages/MonasAlbumPage';
import { StatsPage } from '../pages/StatsPage';
import { WellnessPage } from '../pages/WellnessPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { EditProfilePage } from '../pages/EditProfilePage';
import { CampusMapPage } from '../pages/CampusMapPage';
import { RankingPage } from '../pages/RankingPage';
import { MatchesPage } from '../pages/MatchesPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AnalyticsDashboardPage } from '../pages/AnalyticsDashboardPage';
import { ReportsPage } from '../pages/ReportsPage';
import { EventPublishPage } from '../pages/EventPublishPage';
import { StudentActivityPage } from '../pages/StudentActivityPage';
import { StudentInteractionPage } from '../pages/StudentInteractionPage';
import { WellnessStatsPage } from '../pages/WellnessStatsPage';
import { OrganizerDashboardPage } from '../pages/OrganizerDashboardPage';
import { SchedulePage } from '../pages/SchedulePage';
function NotFound() {
  return <Navigate to="/home" replace />;
}
export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/forgot-password', Component: ForgotPasswordPage },
  { path: '/admin/login', Component: AdminLoginPage },
  { path: '/admin/dashboard', Component: AdminDashboardPage },
  { path: '/admin/analytics', Component: AnalyticsDashboardPage },
  { path: '/admin/reports', Component: ReportsPage },
  { path: '/organizer/dashboard', Component: OrganizerDashboardPage },
  { path: '/organizer/publish-event', Component: EventPublishPage },
  { path: '/student/activity', Component: StudentActivityPage },
  { path: '/student/interaction', Component: StudentInteractionPage },
  { path: '/wellness/stats', Component: WellnessStatsPage },
  { path: '/chat/:id', Component: ChatPage },
  { path: '/direct-chat/:id', Component: DirectChatPage },
  { path: '/parches/create', Component: CreateParchePage },
  { path: '/parches/:id', Component: ParchemDetailPage },
  {
    path: '/',
    Component: Layout,
    children: [
      { path: 'home', Component: HomePage },
      { path: 'parches', Component: ParchesPage },
      { path: 'chat', Component: ChatListPage },
      { path: 'events', Component: EventsPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'monas', Component: MonasAlbumPage },
      { path: 'stats', Component: StatsPage },
      { path: 'wellness', Component: WellnessPage },
      { path: 'bienestar', Component: WellnessPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'edit-profile', Component: EditProfilePage },
      { path: 'campus-map', Component: CampusMapPage },
      { path: 'ranking', Component: RankingPage },
      { path: 'matches', Component: MatchesPage },
      { path: 'user/:userId', Component: UserProfilePage },
      { path: 'schedule', Component: SchedulePage },
    ],
  },
  { path: '*', Component: NotFound },
]);