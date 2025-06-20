// src/context/FilterContext.js
import { createContext, useContext, useState } from "react";

const defaultFilters = {
  region: "",
  technologie: "",
  selectedYear: 2023,
  selectedDate: ""
};

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const setFilter = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === "selectedYear" ? { selectedDate: "" } : {}) // Reset date si année change
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
