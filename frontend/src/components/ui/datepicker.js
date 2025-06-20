import React from 'react';

export const DatePicker = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};