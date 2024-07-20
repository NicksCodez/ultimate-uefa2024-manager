import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// components
import HomeMenu from '../HomeMenu';
import { useAuth } from '../../../contexts/authContext/AuthContext';

jest.mock('../../../contexts/authContext/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('HomeMenu Component', () => {
  const renderHomeMenu = (loggedIn) => {
    useAuth.mockReturnValue({ loggedIn });
    return render(
      <Router>
        <HomeMenu />
      </Router>,
    );
  };

  test('renders common menu items', () => {
    renderHomeMenu(false);

    expect(screen.getByText('Play')).toHaveAttribute('href', '/game');
    expect(screen.getByText('See Teams')).toHaveAttribute('href', '/teams');
    expect(screen.getByText('About')).toHaveAttribute('href', '/about');
  });

  test('renders Login link when user is not logged in', () => {
    renderHomeMenu(false);

    expect(screen.getByText('Login')).toHaveAttribute('href', '/login');
    expect(screen.queryByText('Account')).not.toBeInTheDocument();
  });

  test('renders Account link when user is logged in', () => {
    renderHomeMenu(true);

    expect(screen.getByText('Account')).toHaveAttribute('href', '/profile');
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });
});
