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
import { InboxLayout } from './layouts/Inbox';
import { InboxEmpty, MessageArea } from './pages/InboxPage';
import { UtilsProvider } from './context/UtilsProvider';
import { SavedDetailPage, SavedPage } from './pages/SavedPage';
import ProfileEditPage from './pages/ProfileEditPage';

function App() {
  return (
    <React.Fragment>
      <AuthProvider>
        <UtilsProvider>
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<FeedPage />} />
                <Route path={'/saved/:savedId'} element={<SavedDetailPage />} />
                <Route path={'/profile/edit'} element={<ProfileEditPage />} />
                <Route path={'/profile/saved'} element={<SavedPage />} />
                <Route path={'/profile/:userId'} element={<ProfilePage />} />
                <Route path="/" element={<InboxLayout />}>
                  <Route path="/inbox" element={<InboxEmpty />} />
                  <Route path="/d/:chatId" element={<MessageArea />} />
                </Route>
              </Route>
              <Route path={'/p/:postId'} element={<h1>Posts</h1>} />
            </Route>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UtilsProvider>
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
