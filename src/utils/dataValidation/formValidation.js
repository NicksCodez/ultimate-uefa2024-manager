const validateName = (name) => {
  if (name === '') return 'Name cannot be empty';
  const regex = /^[a-zA-Z0-9_]{1,50}$/;
  if (!regex.test(name))
    return 'Name can have only characters a-z, numbers 0-9 and underscore';
  return '';
};

const validateUsername = (name) => {
  if (name === '') return 'Username cannot be empty';
  const regex = /^[a-zA-Z0-9_]{4,15}$/;
  if (!regex.test(name))
    return 'Usernames can have only characters a-z, numbers 0-9 and underscore, and be between 4 and 15 characters';
  return '';
};

const validateEmail = (name) => {
  if (name === '') return 'Email cannot be empty';
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(name))
    return 'That does not seem to be a valid email address';
  return '';
};

const validatePassword = (name) => {
  if (name === '') return 'Password cannot be empty';
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^\-_])[A-Za-z\d@$!%*?&#^\-_]{8,30}$/;
  if (!regex.test(name))
    return 'Password must be between 8 and 30 characters and contain at least one lowercase letter, one uppercase letter, one number and one special character';
  return '';
};

const validatePasswordConfirm = (name) => {
  const passwordInput = document.getElementById('passwordInput');
  if (name !== passwordInput.value) return 'Passwords must be the same';
  return '';
};

export {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
};
