import React, { useState, useEffect } from "react";

const HoldButton = ({ action, interval = 100, children }) => {
  const [isHeld, setIsHeld] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isHeld) {
      intervalId = setInterval(() => {
        action();
      }, interval);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isHeld, action, interval]);

  const handleMouseDown = () => {
    setIsHeld(true);
    action(); // Trigger the action immediately on mouse down
  };

  const handleMouseUp = () => setIsHeld(false);

  return (
    <div 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Stops action if mouse leaves the button
    >
      {children}
    </div>
  );
};

export default HoldButton;