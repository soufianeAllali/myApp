import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('auth_token');
  const user_role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user_role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
