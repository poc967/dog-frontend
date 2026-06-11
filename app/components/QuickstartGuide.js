'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

const baseVolunteerSections = [
  {
    title: 'Dogs Page',
    bullets: [
      'Use search to quickly find a dog by name, location, or level.',
      'Select one or more dogs with the checkboxes.',
      'Use Move dog(s), Start walk, and New Note from the action bar.',
      'Use End walk in a row when a dog returns.',
    ],
  },
  {
    title: 'Single Dog Page',
    bullets: [
      'Open a dog by clicking their name in the table.',
      'Details: see alerts, diets, behavior context, friends, and misc notes.',
      'Activity History: review the day timeline and location/walk changes.',
      'Behavior Notes: add and review behavior notes for handoffs.',
    ],
  },
];

const staffExtraSections = [
  {
    title: 'Staff Extras',
    bullets: [
      'Add Dog from the top-left actions on the Dogs page.',
      'Use the Details tab on a dog to add whiteboard items:',
      'Alerts, Diet, Behavior, Friends, and Misc updates.',
    ],
  },
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

  const sections = useMemo(() => {
    if (!user) return [];
    if (user.role === 'staff' || user.role === 'admin') {
      return [...baseVolunteerSections, ...staffExtraSections];
    }
    return baseVolunteerSections;
  }, [user]);

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
            Follow this quick flow to log accurate updates during each shift.
            <Link href="/dogs" className="ml-1 underline underline-offset-2">
              Open Dogs page
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-md border p-3">
              <h3 className="font-medium mb-2">{section.title}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ))}
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
            Mark as completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickstartGuide;
