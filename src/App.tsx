import React from 'react';
import './App.css';
import { FeedPage } from './pages/FeedPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/Main';
import { NotFound } from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { ProfilePage } from './pages/ProfilePage';
import { InboxPage } from './pages/InboxPage';

function App() {
  return (
    <React.Fragment>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<FeedPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/inbox" element={<InboxPage />} />
            </Route>
          </Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
