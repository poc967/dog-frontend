'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { TooltipProvider } from '@/app/components/ui/tooltip';
import NavigationBar from './NavigationBar';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <NavigationBar />
        {children}
      </TooltipProvider>
    </AuthProvider>
  );
}
