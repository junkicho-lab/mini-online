import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WordPressLayout from './components/WordPressLayout';
import LoginPage from './pages/LoginPage';
import WordPressDashboardPage from './pages/WordPressDashboardPage';
import WordPressAnnouncementsPage from './pages/WordPressAnnouncementsPage';
import SchedulesPage from './pages/SchedulesPage';
import DocumentsPage from './pages/DocumentsPage';
import NotificationsPage from './pages/NotificationsPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <WordPressLayout>
                  <Routes>
                    <Route path="/dashboard" element={<WordPressDashboardPage />} />
                    <Route path="/announcements" element={<WordPressAnnouncementsPage />} />
                    <Route path="/schedules" element={<SchedulesPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                  </Routes>
                </WordPressLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

