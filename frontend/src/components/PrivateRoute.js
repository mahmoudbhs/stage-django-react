import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, roles = [] }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (roles.length && !roles.includes(user.role)) {
    return <div className="p-4">⛔ Accès refusé</div>;
  }

  return children;
};

export default PrivateRoute;