import React from 'react';

// components
import BackArrowIcon from '../../backArrowIcon/BackArrowIcon';

const PageHeader = ({
  title,
  onBackClick,
  rightElement,
  backButtonText,
  backButtonIcon,
}) => (
  <header>
    <button onClick={onBackClick} type="button">
      <span className="icon">{backButtonIcon || <BackArrowIcon />}</span>
      {backButtonText}
    </button>
    <h2>{title}</h2>
    {rightElement}
  </header>
);

export default PageHeader;
