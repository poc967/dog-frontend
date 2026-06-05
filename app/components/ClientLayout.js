'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { TooltipProvider } from '@/app/components/ui/tooltip';
import NavigationBar from './NavigationBar';
import QuickstartGuide from './QuickstartGuide';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <NavigationBar />
        <QuickstartGuide />
        {children}
      </TooltipProvider>
    </AuthProvider>
  );
}
