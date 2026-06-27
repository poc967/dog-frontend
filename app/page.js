'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (loading) return;
    // If the user has a new board enabled, land there instead of the roster
    if (user?.staffBoardEnabled) {
      router.replace('/board');
    } else if (user?.shiftBoardEnabled) {
      router.replace('/my-shift');
    } else {
      router.replace('/dogs');
    }
  }, [loading, user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
    </div>
  );
}
