import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, firestore, storage } from '../../firebase';

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
import { getStorageUrl } from '../../utils/firebase/firebaseFunctions';

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState('');

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
          <div className="image-upload">
            <label htmlFor="profilePicture">
              <div className="image-placeholder">
                <span>Profile Picture</span>
              </div>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={(e) =>
                  handleImageChange(e, setSelectedImage, setImageError)
                }
              />
            </label>
            {imageError && <p className="error">{imageError}</p>}
          </div>
          <button
            type="submit"
            onClick={(e) =>
              handleUserCreate(
                e,
                nameValue,
                usernameValue,
                emailValue,
                passwordValue,
                selectedImage,
                isNameValid,
                isUsernameValid,
                isEmailValid,
                isPasswordValid,
                isPasswordConfirmValid,
                setCreatingAccount,
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

const handleImageChange = (e, setSelectedImage, setImageError) => {
  const file = e.target.files[0];
  if (file) {
    // make sure picture is valid type and size before setting it, otherwise show error
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setImageError('Image should be of type JPEG, PNG or GIF');
      setSelectedImage(null);
    } else if (file.size > maxSize) {
      setImageError('Image size should be less than 5MB.');
      setSelectedImage(null);
    } else {
      setSelectedImage(file);
      setImageError('');
    }
  } else {
    setSelectedImage(null);
    setImageError('');
  }
};

const handleUserCreate = async (
  e,
  nameValue,
  usernameValue,
  emailValue,
  passwordValue,
  selectedImage,
  isNameValid,
  isUsernameValid,
  isEmailValid,
  isPasswordValid,
  isPasswordConfirmValid,
  setCreatingAccount,
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

      // upload image to firebase storage or select default user profile
      let profilePicUrl = getStorageUrl('defaults/default_profile.png');
      if (selectedImage) {
        const imageRef = ref(
          storage,
          `user_profiles/${uid}/${Date.now()}_${selectedImage.name}`,
        );
        await uploadBytes(imageRef, selectedImage);
        profilePicUrl = await getDownloadURL(imageRef);
      }

      // create user, user email and user username documents
      try {
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
            profilePicUrl,
          });
        });

        // creation completed succesfully, redirect to home and log in happen automatically
        setCreatingAccount(false);
      } catch (transactionError) {
        console.error('transaction failed: ', transactionError);

        // delete user if transaction fails
        await auth.currentUser.delete();
        setCreatingAccount(false);
        throw transactionError;
      }
    } catch (error) {
      console.error('Error creating user: ', error);

      // delete user if transaction fails
      await auth.currentUser.delete();

      setCreatingAccount(false);
    }
  }
};
