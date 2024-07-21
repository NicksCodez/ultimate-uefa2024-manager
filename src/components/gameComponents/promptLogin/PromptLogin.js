import React from 'react';
import { Link } from 'react-router-dom';

// firebase
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../../firebase';

// css
import './PromptLogin.css';

const PromptLogin = () => {
  const doAnonSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Anonymous sign in error: ', error);
    }
  };

  return (
    <div id="login-prompt">
      <p>
        It seems you are not logged in. If you do not log in, you will not be
        able to continue your game should you quit at any point. Do you really
        wish to continue anonymously?
      </p>
      <div className="buttons">
        <button
          type="button"
          className="authentication-button"
          onClick={doAnonSignIn}
        >
          Go undercover
        </button>
        <Link to="/login" className="authentication-button">
          Reveal your identity
        </Link>
      </div>
    </div>
  );
};

export default PromptLogin;
