import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// components
import Home from '../Home';
import { useAuth } from '../../../contexts/authContext/AuthContext';

jest.mock('../../../contexts/authContext/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ loggedIn: false });
  });

  test('renders title and HomeMenu', () => {
    render(
      <Router>
        <Home />
      </Router>,
    );

    expect(screen.getByText('ULTIMATE EURO 2024 MANAGER')).toBeInTheDocument();

    const homeMenuDiv = screen.getByTestId('home-menu');
    expect(homeMenuDiv).toBeInTheDocument();
  });
});
