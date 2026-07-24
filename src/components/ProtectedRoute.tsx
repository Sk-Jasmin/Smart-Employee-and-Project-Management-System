import React from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../types';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  userRole: Role;
  allowedRoles?: Role[];
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  userRole,
  allowedRoles,
  children
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};
