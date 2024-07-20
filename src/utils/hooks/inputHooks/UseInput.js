import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';

const useInputField = (
  initialValue = '',
  validateFunction = null,
  checkInUse = false,
  dependencyValue = null,
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(!validateFunction);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // validate input whenever user types, only after he has already interacted with the input
    // passwordConfirm should also validate when password input chaanges, thus dependencyValue
    if (validateFunction && userInteracted) {
      const validationError = validateFunction(value);
      setError(validationError);
      setIsValid(!validationError);
    }
  }, [value, dependencyValue, userInteracted]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setUserInteracted(true);
  };

  const handleFocus = (event) => {
    const label = event.target.closest('label');
    if (label) {
      label.classList.add('active');
      const placeholder = label.querySelector('.input-placeholder');
      if (placeholder) {
        placeholder.classList.add('active');
        placeholder.classList.remove('no-color');
      }
    }
    setUserInteracted(true);
  };

  const handleBlur = async (event) => {
    const label = event.target.closest('label');
    if (label) {
      label.classList.remove('active');
      const placeholder = label.querySelector('.input-placeholder');
      if (placeholder) {
        if (value !== '') {
          placeholder.classList.add('no-color');
        } else {
          placeholder.classList.remove('active');
        }
      }
    }
    setUserInteracted(true);

    // only check if user with same email or username exists when user clicks out of input
    // ensure value not an empty string before checking if it is in use
    if (checkInUse && value.trim() !== '') {
      await checkInputInUse(event);
    }
  };

  const checkInputInUse = async (event) => {
    // if email or username is already used by other user, then it is not valid
    const inputId = event.target.id;
    let inputName;
    let collectionName;

    if (inputId === 'emailInput') {
      collectionName = 'user_emails';
      inputName = 'email';
    } else if (inputId === 'usernameInput') {
      collectionName = 'user_usernames';
      inputName = 'username';
    } else {
      return;
    }
    // if doc with same id as input value exists in respective collection, then user with that email or username exists
    const docRef = doc(firestore, collectionName, value.toLowerCase());
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      setError(`Sorry, that ${inputName} is already in use`);
      setIsValid(false);
    } else {
      setError('');
      setIsValid(true);
    }
  };

  return {
    value,
    setValue,
    error,
    setError,
    isValid,
    setIsValid,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
};

export default useInputField;
