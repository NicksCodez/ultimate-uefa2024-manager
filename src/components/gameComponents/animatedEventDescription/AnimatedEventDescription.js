import React, { useState, useEffect } from 'react';

const AnimatedEventDescription = ({ id, text, minute, isPenalty }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div key={id} className={`event-description ${isVisible ? 'visible' : ''}`}>
      {!isPenalty ? `Min ${minute}: ${text}` : text}
    </div>
  );
};

export default AnimatedEventDescription;
