import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export function MainLayout() {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
}
