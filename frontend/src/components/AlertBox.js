import React from 'react';

const AlertBox = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
      ⚠️ {message}
    </div>
  );
};

export default AlertBox;