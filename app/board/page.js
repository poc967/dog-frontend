'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UsersContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LevelIndicator from '../components/LevelIndicator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertCircle,
  Plus,
  UserPlus,
  Clock,
  Lock,
  AlertTriangle,
  X,
  Loader2,
  Footprints,
  MapPin,
  FileText,
} from 'lucide-react';
import { Textarea } from '../components/ui/textarea';
import { getDogs } from '../api/dog';
import {
  getActiveShifts,
  createShift,
  assignVolunteer,
  closeShift,
} from '../api/shift-actions';
import {
  moveOrWalkDogs,
  completeWalk,
  createBehaviorNote,
  getLocations,
} from '../api/dog-actions';
import { getLocalTime } from '../helpers/helpers';

const OUT_STATUS_CLASSES = {
  on_walk: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  due_soon: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  default: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
};

function outStatusClass(status) {
  return OUT_STATUS_CLASSES[status] || OUT_STATUS_CLASSES.default;
}

// Build a map of dogId -> { volunteerName, shiftId } from active shifts
function buildAssignmentMap(shifts) {
  const map = {};
  for (const shift of shifts) {
    for (const assignment of shift.assignments) {
      for (const dogEntry of assignment.dogs) {
        const dogId =
          typeof dogEntry.dog === 'object' ? dogEntry.dog._id : dogEntry.dog;
        map[dogId] = {
          volunteerName: assignment.volunteer?.username || 'Unknown',
          volunteerId: assignment.volunteer?._id || assignment.volunteer,
          shiftId: shift._id,
          completed: dogEntry.completed,
          notes: assignment.notes,
        };
      }
    }
  }
  return map;
}

function DogCard({ dog, assignment, shifts, locations, onAssigned, token }) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Action panel: 'walk' | 'move' | 'note' | null
  const [actionPanel, setActionPanel] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const activeShifts = shifts.filter((s) => s.status === 'active');
  const isStaffOnly = dog.staffOnly;
  const isUnassigned = !assignment && !isStaffOnly;
  const isOnWalk = dog.outStatus === 'on_walk' || dog.isWalking;
  const walkableLocations = locations.filter((l) => l.walkable);

  const togglePanel = (panel) => {
    setActionPanel((p) => (p === panel ? null : panel));
    setActionError('');
    setNoteText('');
  };

  const handleAssign = async () => {
    if (!selectedVolunteer || !selectedShift) return;
    setAssigning(true);
    setAssignError('');
    try {
      const shift = shifts.find((s) => s._id === selectedShift);
      const existingAssignment = shift?.assignments.find(
        (a) => (a.volunteer?._id || a.volunteer) === selectedVolunteer,
      );
      const existingDogIds = existingAssignment
        ? existingAssignment.dogs.map((d) => (typeof d.dog === 'object' ? d.dog._id : d.dog))
        : [];
      const dogIds = existingDogIds.includes(dog._id)
        ? existingDogIds
        : [...existingDogIds, dog._id];
      await assignVolunteer(selectedShift, { volunteerId: selectedVolunteer, dogIds }, token);
      setShowAssignForm(false);
      setSelectedVolunteer('');
      setSelectedShift('');
      onAssigned();
    } catch (err) {
      setAssignError(err.message || 'Failed to assign');
    } finally {
      setAssigning(false);
    }
  };

  const handleWalk = async (locationId) => {
    setActionLoading(true);
    setActionError('');
    try {
      await moveOrWalkDogs({ location: locationId, type: 'walk', dogs: [dog._id] }, token);
      setActionPanel(null);
      onAssigned();
    } catch (err) {
      setActionError(err.message || 'Failed to start walk');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndWalk = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      await completeWalk({ dogIds: [dog._id] }, token);
      onAssigned();
    } catch (err) {
      setActionError(err.message || 'Failed to end walk');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMove = async (locationId) => {
    setActionLoading(true);
    setActionError('');
    try {
      await moveOrWalkDogs({ location: locationId, type: 'move', dogs: [dog._id] }, token);
      setActionPanel(null);
      onAssigned();
    } catch (err) {
      setActionError(err.message || 'Failed to move dog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleNote = async () => {
    if (!noteText.trim()) return;
    setActionLoading(true);
    setActionError('');
    try {
      await createBehaviorNote({ dogs: [dog._id], text: noteText.trim() }, token);
      setNoteText('');
      setActionPanel(null);
    } catch (err) {
      setActionError(err.message || 'Failed to save note');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden bg-card ${
        isUnassigned ? 'border-amber-400 dark:border-amber-600' : 'border-border'
      }`}
    >
      {/* Card top */}
      <div className="p-3 pb-2 border-b border-border">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/dogs/${dog._id}`} className="font-medium text-sm truncate pr-2 hover:underline text-primary">
            {dog.name}
          </Link>
          <span className="text-xs text-muted-foreground shrink-0 bg-muted px-1.5 py-0.5 rounded">
            {dog.location?.name || '—'}
          </span>
        </div>
        <LevelIndicator color1={dog.level1} color2={dog.level2} small />
        <div className="mt-1.5">
          <span
            className={`inline-flex text-xs px-1.5 py-0.5 rounded font-medium ${outStatusClass(isOnWalk ? 'on_walk' : dog.outStatus)}`}
          >
            {isOnWalk ? 'Out now' : (dog.outStatusLabel || '—')}
          </span>
          {typeof dog.outElapsedMinutes === 'number' && (
            <span className="text-xs text-muted-foreground ml-1.5">
              {isOnWalk ? `${dog.outElapsedMinutes}m` : `${dog.outElapsedMinutes}m ago`}
            </span>
          )}
        </div>
      </div>

      {/* Assignment info */}
      <div className="px-3 py-2 border-b border-border">
        {isStaffOnly ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Staff only
          </div>
        ) : assignment ? (
          <div>
            <div className="flex items-center gap-1 text-xs text-foreground">
              <span className="text-muted-foreground">→</span>
              {assignment.volunteerName}
              {assignment.completed && (
                <span className="ml-1 text-emerald-600 dark:text-emerald-400">✓</span>
              )}
            </div>
            {assignment.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {assignment.notes}
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                Unassigned
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => setShowAssignForm((v) => !v)}
              >
                {showAssignForm ? 'Cancel' : 'Assign'}
              </Button>
            </div>

            {showAssignForm && (
              <div className="mt-2 space-y-1.5">
                {assignError && <p className="text-xs text-destructive">{assignError}</p>}
                <Select value={selectedShift} onValueChange={setSelectedShift}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select shift…" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeShifts.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {getLocalTime(s.startTime)} shift
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedVolunteer} onValueChange={setSelectedVolunteer} disabled={!selectedShift}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select volunteer…" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedShift &&
                      (shifts.find((s) => s._id === selectedShift)?.assignments || []).map((a) => (
                        <SelectItem key={a.volunteer?._id} value={a.volunteer?._id}>
                          {a.volunteer?.username}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={handleAssign}
                    disabled={assigning || !selectedVolunteer || !selectedShift}
                  >
                    {assigning && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => { setShowAssignForm(false); setSelectedVolunteer(''); setSelectedShift(''); setAssignError(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-3 py-2">
        {actionError && <p className="text-xs text-destructive mb-1.5">{actionError}</p>}

        {/* Walk picker */}
        {actionPanel === 'walk' && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1">Where?</p>
            <div className="flex flex-wrap gap-1">
              {walkableLocations.map((loc) => (
                <Button
                  key={loc._id}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleWalk(loc._id)}
                  disabled={actionLoading}
                >
                  {actionLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  {loc.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Move picker */}
        {actionPanel === 'move' && (
          <div className="mb-2 flex gap-1">
            <Select onValueChange={(val) => handleMove(val)} disabled={actionLoading}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Move to…" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc._id} value={loc._id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin self-center text-muted-foreground" />}
          </div>
        )}

        {/* Note form */}
        {actionPanel === 'note' && (
          <div className="mb-2 space-y-1.5">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a behavior note…"
              className="text-xs h-16 resize-none"
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                className="h-7 text-xs flex-1"
                onClick={handleNote}
                disabled={actionLoading || !noteText.trim()}
              >
                {actionLoading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Save note
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => togglePanel(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex gap-1">
          {isOnWalk ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleEndWalk}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <X className="h-3 w-3 mr-1" />}
              End walk
            </Button>
          ) : (
            <Button
              variant={actionPanel === 'walk' ? 'secondary' : 'outline'}
              size="sm"
              className="h-7 text-xs flex-1"
              onClick={() => togglePanel('walk')}
            >
              <Footprints className="h-3 w-3 mr-1" />
              Walk
            </Button>
          )}
          <Button
            variant={actionPanel === 'move' ? 'secondary' : 'outline'}
            size="sm"
            className="h-7 text-xs px-2"
            onClick={() => togglePanel('move')}
            title="Move to location"
          >
            <MapPin className="h-3 w-3" />
          </Button>
          <Button
            variant={actionPanel === 'note' ? 'secondary' : 'outline'}
            size="sm"
            className="h-7 text-xs px-2"
            onClick={() => togglePanel('note')}
            title="Add note"
          >
            <FileText className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShiftCard({ shift, users, dogs, assignmentMap, onClose, onRefresh, token }) {
  const [closing, setClosing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVolId, setNewVolId] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  // Dog picker state — one volunteer open at a time
  const [editingVolunteerId, setEditingVolunteerId] = useState(null);
  const [dogSelection, setDogSelection] = useState({});
  const [savingDogs, setSavingDogs] = useState(false);
  const [dogsError, setDogsError] = useState('');

  const totalDogs = shift.assignments.reduce((sum, a) => sum + a.dogs.length, 0);
  const doneDogs = shift.assignments.reduce(
    (sum, a) => sum + a.dogs.filter((d) => d.completed).length,
    0,
  );

  const assignedVolunteerIds = new Set(
    shift.assignments.map((a) => a.volunteer?._id || a.volunteer),
  );
  const availableUsers = users.filter(
    (u) => !assignedVolunteerIds.has(u._id) && u.role !== 'admin',
  );

  const handleClose = async () => {
    if (!window.confirm('Close this shift?')) return;
    setClosing(true);
    try {
      await closeShift(shift._id, token);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setClosing(false);
    }
  };

  const handleAddVolunteer = async () => {
    if (!newVolId) return;
    setAdding(true);
    setAddError('');
    try {
      await assignVolunteer(shift._id, { volunteerId: newVolId, dogIds: [] }, token);
      setShowAddForm(false);
      setNewVolId('');
      onRefresh();
    } catch (err) {
      setAddError(err.message || 'Failed to add volunteer');
    } finally {
      setAdding(false);
    }
  };

  const openDogPicker = (assignment) => {
    const currentIds = new Set(
      assignment.dogs.map((d) => (typeof d.dog === 'object' ? d.dog._id : d.dog)),
    );
    const selection = {};
    for (const dog of dogs) {
      selection[dog._id] = currentIds.has(dog._id);
    }
    setDogSelection(selection);
    setEditingVolunteerId(assignment.volunteer?._id);
    setDogsError('');
  };

  const closeDogPicker = () => {
    setEditingVolunteerId(null);
    setDogSelection({});
    setDogsError('');
  };

  const handleSaveDogs = async (volunteerId) => {
    const selectedIds = Object.entries(dogSelection)
      .filter(([, checked]) => checked)
      .map(([id]) => id);
    setSavingDogs(true);
    setDogsError('');
    try {
      await assignVolunteer(shift._id, { volunteerId, dogIds: selectedIds }, token);
      closeDogPicker();
      onRefresh();
    } catch (err) {
      setDogsError(err.message || 'Failed to save');
    } finally {
      setSavingDogs(false);
    }
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden mb-4">
      {/* Shift header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">
            {getLocalTime(shift.startTime)} shift
          </span>
          <Badge variant="success" className="text-xs">Active</Badge>
          <span className="text-xs text-muted-foreground">
            {doneDogs}/{totalDogs} done
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAddForm ? 'secondary' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setShowAddForm((v) => !v);
              setNewVolId('');
              setAddError('');
            }}
          >
            <UserPlus className="h-3 w-3 mr-1" />
            {showAddForm ? 'Cancel' : 'Add volunteer'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleClose}
            disabled={closing}
          >
            {closing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
            Close shift
          </Button>
        </div>
      </div>

      {/* Add volunteer inline form */}
      {showAddForm && (
        <div className="px-4 py-2.5 border-b border-border bg-muted/20">
          <div className="flex gap-2 items-center">
            <Select value={newVolId} onValueChange={setNewVolId}>
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue placeholder="Select volunteer…" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.length === 0 ? (
                  <SelectItem value="__none__" disabled>
                    All users already assigned
                  </SelectItem>
                ) : (
                  availableUsers.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.username}
                      {u.role !== 'volunteer' && (
                        <span className="text-muted-foreground ml-1">({u.role})</span>
                      )}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleAddVolunteer}
              disabled={adding || !newVolId}
            >
              {adding && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              Add
            </Button>
          </div>
          {addError && <p className="text-xs text-destructive mt-1">{addError}</p>}
        </div>
      )}

      {/* Volunteer rows */}
      <div className="divide-y divide-border">
        {shift.assignments.map((assignment) => {
          const volunteerId = assignment.volunteer?._id;
          const done = assignment.dogs.filter((d) => d.completed).length;
          const total = assignment.dogs.length;
          const isEditing = editingVolunteerId === volunteerId;

          return (
            <div key={volunteerId} className="px-4 py-3">
              {/* Volunteer header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {assignment.volunteer?.username}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{done}/{total}</span>
                  <Button
                    variant={isEditing ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={() => (isEditing ? closeDogPicker() : openDogPicker(assignment))}
                  >
                    {isEditing ? 'Cancel' : total === 0 ? 'Assign dogs' : 'Edit dogs'}
                  </Button>
                </div>
              </div>

              {/* Dog picker */}
              {isEditing && (
                <div className="mb-3 rounded-lg border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Select dogs for {assignment.volunteer?.username}
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {dogs.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No dogs available.</p>
                    ) : (
                      dogs.map((dog) => {
                        const takenBy = assignmentMap[dog._id];
                        const takenByOther =
                          takenBy && takenBy.volunteerId !== volunteerId;
                        return (
                          <label
                            key={dog._id}
                            className="flex items-center gap-2 text-xs cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-border"
                              checked={!!dogSelection[dog._id]}
                              onChange={(e) =>
                                setDogSelection((prev) => ({
                                  ...prev,
                                  [dog._id]: e.target.checked,
                                }))
                              }
                            />
                            <span>{dog.name}</span>
                            {takenByOther && (
                              <span className="text-muted-foreground">
                                → {takenBy.volunteerName}
                              </span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                  {dogsError && (
                    <p className="text-xs text-destructive mt-2">{dogsError}</p>
                  )}
                  <Button
                    size="sm"
                    className="h-7 text-xs mt-3"
                    onClick={() => handleSaveDogs(volunteerId)}
                    disabled={savingDogs}
                  >
                    {savingDogs && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    Save
                  </Button>
                </div>
              )}

              {/* Dog chips */}
              <div className="flex flex-wrap gap-1.5">
                {assignment.dogs.map((dogEntry) => {
                  const dog = typeof dogEntry.dog === 'object' ? dogEntry.dog : null;
                  if (!dog) return null;
                  return (
                    <span
                      key={dog._id}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                        dogEntry.completed
                          ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400'
                          : 'border-border text-foreground'
                      }`}
                    >
                      {dog.name}
                      {dogEntry.completed && ' ✓'}
                    </span>
                  );
                })}
                {assignment.dogs.length === 0 && !isEditing && (
                  <span className="text-xs text-muted-foreground italic">
                    No dogs assigned yet
                  </span>
                )}
              </div>

              {assignment.notes && (
                <p className="text-xs text-muted-foreground mt-1.5 italic">
                  {assignment.notes}
                </p>
              )}
            </div>
          );
        })}
        {shift.assignments.length === 0 && (
          <div className="px-4 py-3 text-sm text-muted-foreground">
            No volunteers assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}

const FILTERS = ['all', 'unassigned', 'overdue', 'walk'];

function BoardContent() {
  const { token, user } = useAuth();
  const { users } = useUsers();
  const router = useRouter();
  const [dogs, setDogs] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingShift, setCreatingShift] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      const [dogsData, shiftsData] = await Promise.all([
        getDogs(token),
        getActiveShifts(token),
      ]);
      setDogs(dogsData.message || []);
      setShifts(shiftsData.data || []);
    } catch (err) {
      setError('Failed to load board data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Locations only need to be fetched once
  useEffect(() => {
    if (!token) return;
    getLocations(token)
      .then((data) => setLocations(data.data || data.message || []))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Gate: staff/admin with flag only
  useEffect(() => {
    if (user && !user.staffBoardEnabled && user.role !== 'admin') {
      router.replace('/dogs');
    }
  }, [user, router]);

  const assignmentMap = useMemo(() => buildAssignmentMap(shifts), [shifts]);

  const activeDogs = useMemo(
    () => dogs.filter((d) => !d.isDeleted && !d.staffOnly),
    [dogs],
  );

  const filteredDogs = useMemo(() => {
    return activeDogs.filter((dog) => {
      if (filter === 'all') return true;
      if (filter === 'unassigned') return !assignmentMap[dog._id];
      if (filter === 'overdue') return dog.outStatus === 'overdue';
      if (filter === 'walk') return dog.outStatus === 'on_walk';
      return true;
    });
  }, [activeDogs, filter, assignmentMap]);

  const unassignedCount = useMemo(
    () => activeDogs.filter((d) => !assignmentMap[d._id]).length,
    [activeDogs, assignmentMap],
  );

  const onWalkCount = useMemo(
    () => activeDogs.filter((d) => d.outStatus === 'on_walk').length,
    [activeDogs],
  );

  const overdueCount = useMemo(
    () => activeDogs.filter((d) => d.outStatus === 'overdue').length,
    [activeDogs],
  );

  const handleCreateShift = async () => {
    setCreatingShift(true);
    try {
      await createShift(token);
      await fetchAll();
    } catch (err) {
      setError(err.message || 'Failed to create shift');
    } finally {
      setCreatingShift(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-[90vw] max-w-5xl mx-auto mt-4 mb-8 px-2">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-semibold">Today's board</h1>
        <Button size="sm" onClick={handleCreateShift} disabled={creatingShift}>
          {creatingShift ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-1" />
          )}
          New shift
        </Button>
      </div>

      {/* Active shifts summary */}
      {shifts.length > 0 && (
        <div className="mb-4">
          {shifts.map((shift) => (
            <ShiftCard
              key={shift._id}
              shift={shift}
              users={users}
              dogs={activeDogs}
              assignmentMap={assignmentMap}
              onClose={fetchAll}
              onRefresh={fetchAll}
              token={token}
            />
          ))}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total dogs', value: activeDogs.length },
          { label: 'Assigned', value: activeDogs.length - unassignedCount },
          {
            label: 'Unassigned',
            value: unassignedCount,
            warn: unassignedCount > 0,
          },
          { label: 'On walk', value: onWalkCount },
        ].map(({ label, value, warn }) => (
          <div
            key={label}
            className="bg-muted rounded-lg p-2.5 text-center"
          >
            <div
              className={`text-xs mb-0.5 ${warn ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}
            >
              {label}
            </div>
            <div
              className={`text-xl font-medium ${warn ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'}`}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { key: 'all', label: `All (${activeDogs.length})` },
          { key: 'unassigned', label: `Unassigned (${unassignedCount})` },
          { key: 'overdue', label: `Overdue (${overdueCount})` },
          { key: 'walk', label: `On walk (${onWalkCount})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              filter === key
                ? 'bg-secondary text-foreground border-foreground/40 font-medium'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dog grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {filteredDogs.map((dog) => (
          <DogCard
            key={dog._id}
            dog={dog}
            assignment={assignmentMap[dog._id]}
            shifts={shifts}
            locations={locations}
            onAssigned={fetchAll}
            token={token}
          />
        ))}
        {filteredDogs.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            No dogs match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <ProtectedRoute requiredRole="staff">
      <BoardContent />
    </ProtectedRoute>
  );
}
