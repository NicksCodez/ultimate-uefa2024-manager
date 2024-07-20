import React from 'react';

// css
import './LoginInput.css';

const LoginInput = ({
  id,
  type,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  required = true,
}) => (
  <div className="login-input">
    <label htmlFor={id}>
      <div className="input-placeholder">
        <span>{label}</span>
      </div>
      <div className="input-wrapper">
        <input
          required={required}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </label>
  </div>
);

export default LoginInput;
