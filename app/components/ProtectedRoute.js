'use client';

import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Login from './Login';

const ProtectedRoute = ({ children, requiredRole = 'volunteer' }) => {
  const { user, loading, hasRole, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!hasRole(requiredRole)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to access this page. Required role:{' '}
          <strong>{requiredRole}</strong>
        </p>
        <p className="text-muted-foreground">
          Your role: <strong>{user?.role}</strong>
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
