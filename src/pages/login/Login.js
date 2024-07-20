import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

// components
import PageHeader from '../../components/homeMenu/pageHeader/PageHeader';
import InputField from '../../components/inputField/InputField';

// utils
import useInputField from '../../utils/hooks/inputHooks/UseInput';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

const Login = () => {
  const { loggedIn } = useAuth();

  // component state
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);

  const navigate = useNavigate();
  const onBackClick = () => {
    navigate(-1);
  };

  // forms
  const {
    value: emailValue,
    onChange: emailOnChange,
    onFocus: emailOnFocus,
    onBlur: emailOnBlur,
  } = useInputField();

  const {
    value: passwordValue,
    onChange: passwordOnChange,
    onFocus: passwordOnFocus,
    onBlur: passwordOnBlur,
  } = useInputField('');

  return (
    <div id="login">
      {loggedIn && <Navigate to="/home" replace />}
      <PageHeader title="Login" onBackClick={onBackClick} />
      <form>
        <InputField
          id="emailInput"
          type="email"
          name="email"
          label="Email"
          value={emailValue}
          onChange={emailOnChange}
          onFocus={emailOnFocus}
          onBlur={emailOnBlur}
        />
        <InputField
          id="passwordInput"
          type="password"
          name="password"
          label="Password"
          value={passwordValue}
          onChange={passwordOnChange}
          onFocus={passwordOnFocus}
          onBlur={passwordOnBlur}
        />
        <button
          type="submit"
          onClick={(e) =>
            handleLogin(e, emailValue, passwordValue, setLoggingIn, navigate)
          }
        >
          Log In
        </button>
      </form>

      <p className="no-account">
        Don&apos;t have an account? <a href="/signup">Sign up!</a>
      </p>
      {loggingIn && <div>Logging in</div>}
    </div>
  );
};

export default Login;

const handleLogin = async (e, email, password, setLoggingIn, navigate) => {
  e.preventDefault();
  setLoggingIn(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/home');
  } catch (error) {
    console.error(
      `Error logging in user ${email} with password ${password}:`,
      error,
    );
  }
};
