import React from 'react';
import './App.css';
import { FeedPage } from './pages/Feed';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/Main';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/profile" element={<MainLayout />}>
          <Route index element={<h1>Profile</h1>} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
