import { createContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  const loginUser = async (email, password) => {
   const response = await fetch('http://localhost:8000/api/login/',
 {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })

    });

    const data = await response.json();
    if (response.ok) {
      setAuthTokens(data);
      setUser(data.user);
      localStorage.setItem('authTokens', JSON.stringify(data));
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ authTokens, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;