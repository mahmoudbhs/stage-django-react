import React from 'react';

export const Select = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      >
        <option value="">-- Tous --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};