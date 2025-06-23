import React from 'react';

const Loading = ({ text = "Loading...", color="text-theme-secondaryText" }) => {
  return (
    <div className={`flex flex-row items-center space-x-3 ${color} text-md`}>
      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
      <span className={`text-lg ${color}`}>{text}</span>
    </div>
  );
};

export default Loading;
