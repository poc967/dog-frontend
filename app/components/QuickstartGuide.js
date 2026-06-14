'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

const shiftSteps = [
  'Search for the dog you\'re taking out — use the search bar at the top.',
  'Check their Out Status and any recent notes before you go.',
  'Check the checkbox next to the dog\'s name — the action buttons appear at the top right.',
  'Tap Start Walk and confirm the location.',
  'When the dog returns, tap End Walk in their row.',
  'Click the dog\'s name → Behavior Notes tab to leave a note for the next person.',
];

const staffExtrasBullets = [
  'Use Add Dog and Archive from the top left of the Dogs page.',
  'Open any dog → Details tab to update alerts, diet, behavior, friends, and misc info.',
];

const parseDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const shouldShowQuickstart = (user) => {
  const completedAt = parseDate(user?.quickstart?.completedAt);
  if (completedAt) return false;

  const lastLoginAt = parseDate(user?.lastLogin);
  const lastDismissedAt = parseDate(user?.quickstart?.lastDismissedAt);

  // If dismissed after current login, keep hidden for this login only.
  if (lastLoginAt && lastDismissedAt && lastDismissedAt >= lastLoginAt) {
    return false;
  }

  return true;
};

const QuickstartGuide = () => {
  const { user, isAuthenticated, updateQuickstartStatus } = useAuth();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOpen(false);
      return;
    }

    setOpen(shouldShowQuickstart(user));
  }, [isAuthenticated, user]);

  const handleDismiss = async () => {
    setSaving(true);
    const result = await updateQuickstartStatus('dismiss');
    setSaving(false);
    if (result.success) {
      setOpen(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    const result = await updateQuickstartStatus('complete');
    setSaving(false);
    if (result.success) {
      setOpen(false);
    }
  };

  const handleDialogOpenChange = (nextOpen) => {
    if (!nextOpen && open && !saving) {
      handleDismiss();
      return;
    }

    setOpen(nextOpen);
  };

  if (!isAuthenticated || !user) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>ShelterCue Quickstart</DialogTitle>
          <DialogDescription>
            Here&apos;s what to do on your first shift.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <section className="rounded-md border p-3">
            <h3 className="font-medium mb-2">Your shift workflow</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              {shiftSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          {isStaff && (
            <section className="rounded-md border p-3">
              <h3 className="font-medium mb-2">Staff extras</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {staffExtrasBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleDismiss}
            disabled={saving}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Dismiss for now
          </Button>
          <Button type="button" onClick={handleComplete} disabled={saving}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickstartGuide;
