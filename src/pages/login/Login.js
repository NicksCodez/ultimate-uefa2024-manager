import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// components
import PageHeader from '../../components/homeMenu/pageHeader/PageHeader';
import LoginInput from '../../components/loginInput/LoginInput';

// utils
import useLoginInput from '../../utils/hooks/loginHooks/UseLoginInput';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const { loggedIn } = useAuth();

  const {
    value: emailValue,
    onChange: emailOnChange,
    onFocus: emailOnFocus,
    onBlur: emailOnBlur,
  } = useLoginInput('');

  const {
    value: passwordValue,
    onChange: passwordOnChange,
    onFocus: passwordOnFocus,
    onBlur: passwordOnBlur,
  } = useLoginInput('');

  const onBackClick = () => {
    navigate(-1);
  };

  const handleLogIn = (e) => {
    e.preventDefault();
    console.log('logging in');
  };

  useEffect(() => {
    console.log({ emailValue });
  }, [emailValue]);

  useEffect(() => {
    console.log({ passwordValue });
  }, [passwordValue]);

  return (
    <div id="login">
      {loggedIn && <Navigate to="/home" replace />}
      <PageHeader title="Login" onBackClick={onBackClick} />
      <form>
        <LoginInput
          id="emailInput"
          type="email"
          name="email"
          label="Email"
          value={emailValue}
          onChange={emailOnChange}
          onFocus={emailOnFocus}
          onBlur={emailOnBlur}
        />
        <LoginInput
          id="passwordInput"
          type="password"
          name="password"
          label="Password"
          value={passwordValue}
          onChange={passwordOnChange}
          onFocus={passwordOnFocus}
          onBlur={passwordOnBlur}
        />
        <button type="submit" onClick={(e) => handleLogIn(e)}>
          Log In
        </button>
      </form>

      <p className="no-account">
        Don&apos;t have an account? <a href="/signup">Sign up!</a>
      </p>
    </div>
  );
};

export default Login;
