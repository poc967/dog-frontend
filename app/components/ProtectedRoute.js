'use client';

import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '@blueprintjs/core';
import styled from 'styled-components';
import Login from './Login';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const UnauthorizedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
`;

const ProtectedRoute = ({ children, requiredRole = 'volunteer' }) => {
  const { user, loading, hasRole, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner size={50} />
      </LoadingWrapper>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated but doesn't have required role
  if (!hasRole(requiredRole)) {
    return (
      <UnauthorizedWrapper>
        <h2>Access Denied</h2>
        <p>
          You don&apos;t have permission to access this page. Required role:{' '}
          <strong>{requiredRole}</strong>
        </p>
        <p>
          Your role: <strong>{user?.role}</strong>
        </p>
      </UnauthorizedWrapper>
    );
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;
