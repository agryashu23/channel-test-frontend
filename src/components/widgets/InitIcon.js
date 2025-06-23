import React from 'react';
import PropTypes from 'prop-types';

const Initicon = ({ text, size }) => {
  const getInitials = (name) => {
    if(name){
      const namesArray = name.trim().split(' ');
      if (namesArray.length === 1) {
        return namesArray[0].charAt(0).toUpperCase();
      }
      return namesArray[0].charAt(0).toUpperCase() + namesArray[namesArray.length - 1].charAt(0).toUpperCase();
    }
  
  };

  const initials = getInitials(text);

  const containerStyle = {
    width: `${size+2}px`,
    height: `${size}px`,
    fontSize: `${size / 2}px`,
    borderWidth:"2px"
  };

  return (
    <div
      className="flex items-center justify-center bg-initBorder text-sm text-red-950 rounded-xl border  border-white"
      style={containerStyle}
    >
      {initials}
    </div>
  );
};

Initicon.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

export default Initicon;
