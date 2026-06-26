'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { UsersProvider } from '../contexts/UsersContext';
import { TooltipProvider } from '@/app/components/ui/tooltip';
import NavigationBar from './NavigationBar';
import QuickstartGuide from './QuickstartGuide';

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <TooltipProvider>
        <UsersProvider>
          <NavigationBar />
          <QuickstartGuide />
          {children}
        </UsersProvider>
      </TooltipProvider>
    </AuthProvider>
  );
}
