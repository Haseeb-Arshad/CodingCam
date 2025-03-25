import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Login } from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Leaderboard from '@/pages/Leaderboard';
import PrivateRoute from '@/components/PrivateRoute';
import Profile from '@/pages/Profile';
import Projects from '@/pages/Projects';
import ProjectDetails from '@/pages/ProjectDetails';
import Insights from '@/pages/Insights';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import Goals from '@/pages/Goals';
import Teams from '@/pages/Teams';
import GlobalProgress from '@/pages/GlobalProgress';

// Styles for KendoReact
import '@progress/kendo-theme-default/dist/all.css';

// ScrollToTop component to reset scroll position on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
            <Route path="/projects/:projectName" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
            <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
            <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
            <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
            <Route path="/global-progress" element={<PrivateRoute><GlobalProgress /></PrivateRoute>} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
