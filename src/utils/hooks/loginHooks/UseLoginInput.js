import { useState } from 'react';

const useLoginInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleFocus = (event) => {
    const label = event.target.closest('label');
    label.classList.add('active');
    label.querySelector('.input-placeholder').classList.add('active');
    label.querySelector('.input-placeholder').classList.remove('no-color');
  };

  const handleBlur = (event) => {
    const label = event.target.closest('label');
    label.classList.remove('active');
    if (value !== '') {
      label.querySelector('.input-placeholder').classList.add('no-color');
    } else {
      label.querySelector('.input-placeholder').classList.remove('active');
    }
  };

  return {
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
};

export default useLoginInput;
