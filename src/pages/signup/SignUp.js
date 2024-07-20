import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';

// components
import PageHeader from '../../components/homeMenu/pageHeader/PageHeader';
import InputField from '../../components/inputField/InputField';

// utils
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from '../../utils/dataValidation/formValidation';
import useInputField from '../../utils/hooks/inputHooks/UseInput';

// context
import { useAuth } from '../../contexts/authContext/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const onBackClick = () => {
    navigate(-1);
  };

  // component state
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [errorCreatingAccount, setErrorCreatingAccount] = useState(null);

  // user logged in or not
  const { loggedIn } = useAuth();

  // form hooks
  const {
    value: nameValue,
    error: nameError,
    isValid: isNameValid,
    onChange: handleNameChange,
    onFocus: handleNameFocus,
    onBlur: handleNameBlur,
  } = useInputField('', validateName, true);

  const {
    value: usernameValue,
    error: usernameError,
    isValid: isUsernameValid,
    onChange: handleUsernameChange,
    onFocus: handleUsernameFocus,
    onBlur: handleUsernameBlur,
  } = useInputField('', validateUsername, true);

  const {
    value: emailValue,
    error: emailError,
    isValid: isEmailValid,
    onChange: handleEmailChange,
    onFocus: handleEmailFocus,
    onBlur: handleEmailBlur,
  } = useInputField('', validateEmail, true);

  const {
    value: passwordValue,
    error: passwordError,
    isValid: isPasswordValid,
    onChange: handlePasswordChange,
    onFocus: handlePasswordFocus,
    onBlur: handlePasswordBlur,
  } = useInputField('', (value) => validatePassword(value), true);

  const {
    value: passwordConfirmValue,
    error: passwordConfirmError,
    isValid: isPasswordConfirmValid,
    onChange: handlePasswordConfirmChange,
    onFocus: handlePasswordConfirmFocus,
    onBlur: handlePasswordConfirmBlur,
  } = useInputField(
    '',
    (value) => validatePasswordConfirm(value),
    true,
    passwordValue,
  );

  return (
    <div id="sign-up">
      {loggedIn && <Navigate to="/home" replace />}
      <PageHeader title="Sign Up" onBackClick={onBackClick} />
      <div id="sign-up-main">
        <form>
          <InputField
            id="nameInput"
            type="name"
            name="name"
            label="Name"
            value={nameValue}
            error={nameError}
            onChange={handleNameChange}
            onFocus={handleNameFocus}
            onBlur={handleNameBlur}
            validate
          />
          <InputField
            id="usernameInput"
            type="username"
            name="username"
            label="Username"
            value={usernameValue}
            error={usernameError}
            onChange={handleUsernameChange}
            onFocus={handleUsernameFocus}
            onBlur={handleUsernameBlur}
            validate
          />
          <InputField
            id="emailInput"
            type="email"
            name="email"
            label="Email"
            value={emailValue}
            error={emailError}
            onChange={handleEmailChange}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            validate
          />
          <InputField
            id="passwordInput"
            type="password"
            name="password"
            label="Password"
            value={passwordValue}
            error={passwordError}
            onChange={handlePasswordChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            validate
          />
          <InputField
            id="passwordConfirmInput"
            type="password"
            name="passwordConfirm"
            label="Confirm Password"
            value={passwordConfirmValue}
            error={passwordConfirmError}
            onChange={handlePasswordConfirmChange}
            onFocus={handlePasswordConfirmFocus}
            onBlur={handlePasswordConfirmBlur}
            validate
          />
          <button
            type="submit"
            onClick={(e) =>
              handleUserCreate(
                e,
                nameValue,
                usernameValue,
                emailValue,
                passwordValue,
                isNameValid,
                isUsernameValid,
                isEmailValid,
                isPasswordValid,
                isPasswordConfirmValid,
                setCreatingAccount,
                navigate,
              )
            }
          >
            Submit
          </button>
        </form>
        {creatingAccount && <div>Am creating account</div>}
      </div>
    </div>
  );
};

export default SignUp;

const handleUserCreate = async (
  e,
  nameValue,
  usernameValue,
  emailValue,
  passwordValue,
  isNameValid,
  isUsernameValid,
  isEmailValid,
  isPasswordValid,
  isPasswordConfirmValid,
  setCreatingAccount,
  navigate,
) => {
  e.preventDefault();
  setCreatingAccount(true);
  if (
    isNameValid &&
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    isPasswordConfirmValid
  ) {
    try {
      // create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue,
      );
      const { uid } = userCredential.user;

      // create user, user email and user username documents
      await runTransaction(firestore, async (transaction) => {
        const userRef = doc(firestore, 'users', uid);
        const emailRef = doc(
          firestore,
          'user_emails',
          emailValue.toLowerCase(),
        );
        const usernameRef = doc(
          firestore,
          'user_usernames',
          usernameValue.toLowerCase(),
        );

        // make sure documents do not already exist

        const emailDoc = await transaction.get(emailRef);
        const usernameDoc = await transaction.get(usernameRef);
        const userDoc = await transaction.get(userRef);

        if (emailDoc.exists()) {
          throw new Error('Email already in use');
        }

        if (usernameDoc.exists()) {
          throw new Error('Username already in use');
        }

        if (userDoc.exists()) {
          throw new Error('User document already in use');
        }

        // set documents
        transaction.set(emailRef, { uid });
        transaction.set(usernameRef, { uid });
        transaction.set(userRef, {
          email: emailValue.toLowerCase(),
          username: usernameValue,
          usernameLowercase: usernameValue.toLowerCase(),
          name: nameValue,
          nameLowercase: nameValue.toLowerCase(),
        });
      });
    } catch (error) {
      console.error('Error creating user: ', error);
    }
  }

  setCreatingAccount(false);
  navigate('/login');
};
