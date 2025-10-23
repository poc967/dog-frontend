'use client';

import { AuthProvider } from '../contexts/AuthContext';
import NavigationBar from './NavigationBar';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <NavigationBar />
      {children}
    </AuthProvider>
  );
}
