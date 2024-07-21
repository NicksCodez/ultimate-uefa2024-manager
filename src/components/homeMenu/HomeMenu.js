import React from 'react';
import { Link } from 'react-router-dom';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

// css
import './HomeMenu.css';

const HomeMenu = () => {
  const { loggedIn } = useAuth();

  return (
    <div id="home-menu" data-testid="home-menu">
      <nav>
        <ul>
          <li>
            <Link to="/game">Play</Link>
          </li>
          <li>
            <Link to="/teams">See Teams</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {loggedIn ? (
            <li>
              <Link to="/profile">Account</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default HomeMenu;
