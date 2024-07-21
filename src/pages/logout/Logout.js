import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// firebase
import { auth } from '../../firebase';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

// components
import PageHeader from '../../components/homeMenu/pageHeader/PageHeader';

// css
import './Logout.css';

const LogOut = () => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  // component state
  const [loggingOut, setLoggingOut] = useState(false);
  const [errorLoggingOut, setErrorLoggingOut] = useState(null);

  const handleLogOut = async (e) => {
    e.preventDefault();
    setLoggingOut(true);
    try {
      await auth.signOut();
      navigate('/home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setLoggingOut(false);
  };

  return (
    <div id="logout">
      {!loggedIn && <Navigate to="/home" replace />}
      <PageHeader title="Log Out" />
      <div id="logout-main">
        <p>
          So you want to log out, huh? No worries, you can always come back to
          us!
        </p>
        <button
          type="button"
          className="authentication-button"
          onClick={(e) => handleLogOut(e)}
        >
          Log out
        </button>
      </div>
      {loggingOut && <div>Am logging out</div>}
    </div>
  );
};

export default LogOut;
