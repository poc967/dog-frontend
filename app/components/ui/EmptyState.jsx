'use client';

import { Button } from '@/app/components/ui/button';

export default function EmptyState({ icon: Icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4" />}
      {title && <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {typeof action === 'string' && onAction ? (
        <Button variant="outline" size="sm" onClick={onAction}>
          {action}
        </Button>
      ) : action ? (
        <div className="mt-2">{action}</div>
      ) : null}
    </div>
  );
}
