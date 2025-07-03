
import React from 'react';

const PaymentLoading = ({ color="text-theme-secondaryText" }) => {
  return (
    <div className={`flex flex-col items-center space-y-1 space-x-3 ${color} text-md text-center`}>
      <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
      <p>Please wait while we process your payment...</p>
      <p>Don't press the back button.</p>
    </div>
  );
};

export default PaymentLoading;
