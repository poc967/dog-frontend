'use client';
import { Loader2 } from 'lucide-react';

export default function Loading({ size = 40 }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="animate-spin text-muted-foreground" style={{ width: size, height: size }} />
    </div>
  );
}
