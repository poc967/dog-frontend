'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import { Spinner } from '@blueprintjs/core';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dogs');
      }
      // If not authenticated, the ProtectedRoute will handle showing the login
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner size={50} />
      </LoadingWrapper>
    );
  }

  return (
    <LoadingWrapper>
      <Spinner size={50} />
    </LoadingWrapper>
  );
}
