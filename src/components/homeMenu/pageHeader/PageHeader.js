import React from 'react';

// components
import BackArrowIcon from '../../backArrowIcon/BackArrowIcon';

// css
import './PageHeader.css';

const PageHeader = ({
  title,
  onBackClick,
  rightElement,
  backButtonText,
  backButtonIcon,
}) => (
  <header id="page-header">
    <button onClick={onBackClick} type="button" className="left">
      <div className="icon">{backButtonIcon || <BackArrowIcon />}</div>
      {backButtonText}
    </button>
    <h2>{title}</h2>
    {rightElement || <div className="min-w" />}
  </header>
);

export default PageHeader;
