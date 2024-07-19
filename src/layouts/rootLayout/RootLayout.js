import React from 'react';
import { Outlet } from 'react-router-dom';

const RootLayout = () => (
  <div id="root-layout">
    <main id="main">
      <Outlet />
    </main>
  </div>
);

export default RootLayout;
