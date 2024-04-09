/**
 * @file ProtectedRoute.js
 * @description This component represents a protected route that requires authentication.
 * @author Marlon D'Ambrosio
 * @version 1.0
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - The child components to render if authenticated
 * @returns {JSX.Element} The rendered protected route component
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;