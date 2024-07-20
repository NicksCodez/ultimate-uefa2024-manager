import React from 'react';

// css
import './InputField.css';

const InputField = ({
  id,
  type,
  name,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  validate,
}) => (
  <div className="input-field">
    <label htmlFor={id}>
      <div className="input-placeholder">
        <span>{label}</span>
      </div>
      <div className="input-wrapper">
        <input
          required
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
    {validate && error && (
      <div className={`error ${error ? 'active' : ''}`}>
        <span>{error}</span>
      </div>
    )}
  </div>
);

export default InputField;
