import React from 'react';
import './App.css';
import { FeedPage } from './pages/Feed';
import { LoginPage } from './pages/Login';
import { ProfilePage } from './pages/Profile';
import { RegisterPage } from './pages/Register';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/Main';

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="" element={<MainLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<h1>404</h1>} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
