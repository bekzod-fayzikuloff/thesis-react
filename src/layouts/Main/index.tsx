import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';

export function MainLayout() {
  return (
    <React.Fragment>
      <main
        style={{
          display: 'flex'
        }}
      >
        <Sidebar />
        <Outlet />
      </main>
    </React.Fragment>
  );
}
