'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LevelIndicator from '../components/LevelIndicator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertCircle, Bell, Footprints, FileText, Check, Loader2, X } from 'lucide-react';
import { getActiveShifts, completeDog } from '../api/shift-actions';
import { moveOrWalkDogs, completeWalk, getLocations } from '../api/dog-actions';
import { getLocalTime, formatElapsed } from '../helpers/helpers';
import Link from 'next/link';

const OUT_STATUS_CLASSES = {
  on_walk: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  due_soon: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  default: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
};

function outStatusClass(status) {
  return OUT_STATUS_CLASSES[status] || OUT_STATUS_CLASSES.default;
}

function DogShiftCard({ dogEntry, shiftId, walkableLocations, onUpdate, token }) {
  const dog = typeof dogEntry.dog === 'object' ? dogEntry.dog : null;
  // outStatus is computed by the dogs endpoint but not the shift endpoint,
  // so fall back to isWalking for the on_walk check
  const isOnWalk = dog?.outStatus === 'on_walk' || dog?.isWalking;
  const [marking, setMarking] = useState(false);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [localCompleted, setLocalCompleted] = useState(dogEntry.completed);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [error, setError] = useState('');

  if (!dog) return null;

  const handleMarkDone = async () => {
    setMarking(true);
    setError('');
    try {
      await completeDog(shiftId, dog._id, true, token);
      setLocalCompleted(true);
      onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to mark done');
    } finally {
      setMarking(false);
    }
  };

  const handleStartWalk = async (locationId) => {
    setStarting(true);
    setShowLocationPicker(false);
    setError('');
    try {
      await moveOrWalkDogs(
        { location: locationId, type: 'walk', dogs: [dog._id] },
        token,
      );
      onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to start walk');
    } finally {
      setStarting(false);
    }
  };

  const handleEndWalk = async () => {
    setEnding(true);
    setError('');
    try {
      await completeWalk({ dogIds: [dog._id] }, token);
      onUpdate();
    } catch (err) {
      setError(err.message || 'Failed to end walk');
    } finally {
      setEnding(false);
    }
  };

  if (localCompleted) {
    return (
      <div className="border border-border rounded-xl overflow-hidden opacity-60">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-medium">{dog.name}</span>
            <LevelIndicator color1={dog.level1} color2={dog.level2} small />
          </div>
          <Badge variant="success">Done</Badge>
        </div>
        <div className="px-4 py-2.5 flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          Marked complete
          {dogEntry.completedAt && (
            <span className="text-muted-foreground ml-1">
              · {getLocalTime(dogEntry.completedAt)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Link
            href={`/dogs/${dog._id}`}
            className="font-medium hover:underline"
          >
            {dog.name}
          </Link>
          <LevelIndicator color1={dog.level1} color2={dog.level2} small />
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${outStatusClass(isOnWalk ? 'on_walk' : dog.outStatus)}`}
        >
          {isOnWalk ? 'Out now' : (dog.outStatusLabel || '—')}
          {isOnWalk && typeof dog.outElapsedMinutes === 'number'
            ? ` · ${formatElapsed(dog.outElapsedMinutes)}`
            : !isOnWalk && typeof dog.outElapsedMinutes === 'number'
              ? ` · ${formatElapsed(dog.outElapsedMinutes)} ago`
              : ''}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {/* Alerts */}
        {dog.alerts?.filter((a) => !a.isDeleted).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {dog.alerts
              .filter((a) => !a.isDeleted)
              .map((alert) => (
                <span
                  key={alert._id}
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border ${
                    alert.priority === 'red' || alert.priority === 'danger'
                      ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300'
                      : alert.priority === 'green' || alert.priority === 'good'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                        : 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300'
                  }`}
                >
                  {alert.text}
                </span>
              ))}
          </div>
        )}

        {/* Out status detail */}
        {typeof dog.dueInMinutes === 'number' && !isOnWalk && (
          <p className="text-xs text-muted-foreground mb-1">
            {dog.dueInMinutes <= 0 ? 'Due now' : `Due in ${dog.dueInMinutes}m`}
          </p>
        )}

        {/* Special instructions */}
        {dogEntry.notes && (
          <div className="bg-muted rounded-md px-3 py-2 text-xs text-muted-foreground flex gap-1.5 mt-1">
            <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            {dogEntry.notes}
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive mt-1.5">{error}</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-2.5 border-t border-border">
        {/* Location picker — shown when volunteer taps Start walk */}
        {showLocationPicker && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1.5">Where are you going?</p>
            <div className="flex flex-wrap gap-1.5">
              {walkableLocations.map((loc) => (
                <Button
                  key={loc._id}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleStartWalk(loc._id)}
                  disabled={starting}
                >
                  {starting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                  {loc.name}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={() => setShowLocationPicker(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
        {isOnWalk ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground flex-1"
            onClick={handleEndWalk}
            disabled={ending}
          >
            {ending ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <X className="h-4 w-4 mr-1" />
            )}
            End walk
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setShowLocationPicker((v) => !v)}
            disabled={starting}
          >
            {starting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Footprints className="h-4 w-4 mr-1" />
            )}
            {showLocationPicker ? 'Cancel' : 'Start walk'}
          </Button>
        )}

        <Button variant="outline" size="sm" asChild>
          <Link href={`/dogs/${dog._id}`}>
            <FileText className="h-4 w-4 mr-1" />
            Note
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
          onClick={handleMarkDone}
          disabled={marking || isOnWalk}
        >
          {marking ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Done
        </Button>
      </div>
    </div>
    </div>
  );
}

function MyShiftContent() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [myAssignments, setMyAssignments] = useState([]);
  const [myShiftId, setMyShiftId] = useState(null);
  const [shiftTime, setShiftTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [walkableLocations, setWalkableLocations] = useState([]);
  const prevAssignmentKey = useRef('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const fetchShift = useCallback(async () => {
    if (!token || !user) return;
    try {
      const data = await getActiveShifts(token);
      const shifts = data.data || [];

      // Find the shift this volunteer is in
      let found = null;
      let foundShiftId = null;
      let foundShiftTime = null;

      for (const shift of shifts) {
        const assignment = shift.assignments.find(
          (a) =>
            (a.volunteer?._id || a.volunteer) === user._id ||
            (a.volunteer?._id || a.volunteer) === String(user._id),
        );
        if (assignment) {
          found = assignment;
          foundShiftId = shift._id;
          foundShiftTime = shift.startTime;
          break;
        }
      }

      if (found) {
        // Detect changes for the update banner
        const key = JSON.stringify(found.dogs.map((d) => d.dog?._id || d.dog));
        if (prevAssignmentKey.current && key !== prevAssignmentKey.current) {
          setShowUpdateBanner(true);
        }
        prevAssignmentKey.current = key;
        setMyAssignments(found.dogs);
        setMyShiftId(foundShiftId);
        setShiftTime(foundShiftTime);
      } else {
        setMyAssignments([]);
        setMyShiftId(null);
        setShiftTime(null);
        prevAssignmentKey.current = '';
      }
    } catch (err) {
      // Ignore errors from aborted requests (e.g. navigating away mid-flight)
      if (mounted.current) {
        setError('Failed to load shift data.');
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchShift();
    const interval = setInterval(fetchShift, 30000);
    return () => clearInterval(interval);
  }, [fetchShift]);

  // Fetch walkable locations once on mount
  useEffect(() => {
    if (!token) return;
    getLocations(token)
      .then((data) => {
        const all = data.data || data.message || [];
        setWalkableLocations(all.filter((l) => l.walkable));
      })
      .catch(() => {});
  }, [token]);

  // Gate by flag
  useEffect(() => {
    if (user && !user.shiftBoardEnabled) {
      router.replace('/dogs');
    }
  }, [user, router]);

  const totalDogs = myAssignments.length;
  const doneDogs = myAssignments.filter((d) => d.completed).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-[95vw] max-w-lg mx-auto mt-4 mb-8 px-2">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="mb-1">
        <h1 className="text-xl font-semibold">My shift</h1>
      </div>

      {shiftTime && (
        <p className="text-sm text-muted-foreground mb-4">
          {getLocalTime(shiftTime)} · {totalDogs} dog{totalDogs !== 1 ? 's' : ''} assigned
          {totalDogs > 0 && ` · ${doneDogs} done`}
        </p>
      )}

      {/* Update banner */}
      {showUpdateBanner && (
        <Alert className="mb-4 border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700">
          <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-700 dark:text-blue-300 flex items-center justify-between">
            Your assignments were updated by staff.
            <button
              className="ml-2 text-blue-500 hover:text-blue-700"
              onClick={() => setShowUpdateBanner(false)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* No assignment state */}
      {myAssignments.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
          No assignments yet for this shift. Check with staff for your dogs.
        </div>
      ) : (
        <div className="space-y-3">
          {myAssignments.map((dogEntry, idx) => (
            <DogShiftCard
              key={`${dogEntry.dog?._id || idx}`}
              dogEntry={dogEntry}
              shiftId={myShiftId}
              walkableLocations={walkableLocations}
              onUpdate={fetchShift}
              token={token}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyShiftPage() {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <MyShiftContent />
    </ProtectedRoute>
  );
}
