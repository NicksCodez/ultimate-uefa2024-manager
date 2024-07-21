import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';

// pages
import Home from './pages/home/Home';
import NotFound from './pages/notFound/NotFound';
import Game from './pages/game/Game';
import Teams from './pages/teams/Teams';
import About from './pages/about/About';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import Profile from './pages/profile/Profile';
import LogOut from './pages/logout/Logout';

// layouts
import RootLayout from './layouts/rootLayout/RootLayout';

// context
import { AuthProvider } from './contexts/authContext/AuthContext';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<NotFound />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

  return (
    <div id="app">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
