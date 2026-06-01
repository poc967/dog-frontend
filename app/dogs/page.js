'use client';

import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/app/components/ui/table';
import {
  Loader2,
  Plus,
  Archive,
  ArrowLeftRight,
  Footprints,
  FileText,
  X,
  AlertCircle,
} from 'lucide-react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';

// components
import LevelIndicator from '../components/LevelIndicator';
import MoveDog from '../components/MoveDog';
import EndWalk from '../components/EndWalk';
import AddDog from '../components/AddDog';
import ProtectedRoute from '../components/ProtectedRoute';
import { devices } from '../constants/constants';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { getDogs } from '../api/dog';
import {
  createDog,
  moveOrWalkDogs,
  completeWalk,
  createBehaviorNote,
  getLocations,
  removeDogs,
} from '../api/dog-actions';
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 75vw;

  @media ${devices['2xl']} {
    width: 75vw;
  }
  @media ${devices.xl} {
    width: 80vw;
  }
  @media ${devices.lg} {
    width: 80vw;
  }
  @media ${devices.md} {
    width: 95vw;
  }
  @media ${devices.sm} {
    width: 95vw;
  }
  @media ${devices.xs} {
    width: 95vw;
  }
`;

const DogsContent = () => {
  const { hasRole, token } = useAuth();
  // const [domSize, setDomSize] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });
  const [includeButtonNames, setIncludeButtonNames] = useState(false);
  const [moveDogModalOpen, setMoveDogModalOpen] = useState(false);
  const [endWalkModalOpen, setEndWalkModalOpen] = useState(false);
  const [addDogModalOpen, setAddDogModalOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [fetchingDogs, setFetchingDogs] = useState(false);
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [endingWalkDog, setEndingWalkDog] = useState('');
  const [modalType, setModalType] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [behaviorNote, setBehaviorNote] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getOutStatusClasses = (status) => {
    switch (status) {
      case 'on_walk':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'due_soon':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
    }
  };

  const filteredDogs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return dogs;

    return dogs.filter((dog) => {
      const searchableValues = [
        dog.name,
        dog.location?.name,
        dog.level1,
        dog.level2,
      ];

      return searchableValues.some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(normalizedQuery),
      );
    });
  }, [dogs, searchQuery]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setDomSize({ width: window.innerWidth, height: window.innerHeight });
  //   };

  //   window.addEventListener('resize', handleResize);

  //   // Cleanup function to remove event listener when component unmounts
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // useEffect(() => {
  //   // Check if the DOM size meets a certain condition
  //   if (domSize.width > 910) {
  //     // Update component state accordingly
  //     setIncludeButtonNames(true);
  //   } else {
  //     setIncludeButtonNames(false);
  //   }
  // }, [domSize]);

  const fetchDogs = useCallback(async () => {
    if (!token) return;

    setFetchingDogs(true);
    try {
      const data = await getDogs(token);
      setDogs(data.message);
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setActionError('Failed to refresh dogs. Please try again.');
    } finally {
      setFetchingDogs(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  useEffect(() => {
    async function fetchLocations() {
      if (!token) return; // Wait for token to be available

      try {
        const data = await getLocations(token);
        setLocations(data.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    }

    fetchLocations();
  }, [token]);

  const toggleModalOpen = async (type) => {
    if (!moveDogModalOpen == true) {
      await setModalType(type);
    } else {
      setModalType(null);
    }
    await setMoveDogModalOpen(!moveDogModalOpen);
  };

  const submitEndWalk = async (dogToUpdate) => {
    setActionError('');
    setActionSuccess('');
    setEndingWalkDog(dogToUpdate._id);

    try {
      const data = {
        dogIds: [dogToUpdate._id],
      };
      const res = await completeWalk(data, token);

      setDogs(
        dogs.map((dog) => {
          return dog._id == dogToUpdate._id
            ? {
                ...dog,
                isWalking: false,
                lastOutAt: new Date().toISOString(),
                lastOutType: 'walk',
                outStatus: 'returned',
                outStatusLabel: 'Returned',
                outElapsedMinutes: 0,
                dueInMinutes: Number(dog.targetOutIntervalMinutes) || 240,
                location: {
                  ...res.data.location,
                  name: res.data.location.name,
                },
              }
            : dog;
        }),
      );
      setActionSuccess('Walk completed successfully.');
      setEndingWalkDog('');
    } catch (error) {
      console.error('Error ending walk:', error);
      if (error.status === 409) {
        setActionError(
          error.message ||
            'This walk was already completed by another user. Data has been refreshed.',
        );
        await fetchDogs();
      } else {
        setActionError(
          error.message || 'Failed to complete walk. Please try again.',
        );
      }
      setEndingWalkDog('');
    }
  };

  const handleSelectDog = (dog, event) => {
    switch (event.target.checked) {
      case true:
        setSelectedDogs([...selectedDogs, dog]);
        break;
      case false:
        setSelectedDogs(
          selectedDogs.filter((selectedDog) => selectedDog._id !== dog._id),
        );
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (type) => {
    const dogIds = selectedDogs.map((selectedDog) => selectedDog._id);
    setActionError('');
    setActionSuccess('');

    try {
      if (type === 'walk' || type === 'move') {
        const body = {
          location: newLocation,
          type: modalType,
          dogs: dogIds,
        };

        await moveOrWalkDogs(body, token);

        // update dogs state with new location
        function getLocationObject() {
          let obj = locations.find((item) => item._id === newLocation);
          return obj;
        }

        let newLocationObj = getLocationObject();

        setDogs(
          dogs.map((dog) => {
            const isWalkStart = modalType === 'walk';

            return dogIds.includes(dog._id)
              ? {
                  ...dog,
                  isWalking: isWalkStart ? true : false,
                  ...(isWalkStart
                    ? {
                        lastOutAt: new Date().toISOString(),
                        lastOutType: 'walk',
                        outStatus: 'on_walk',
                        outStatusLabel: 'Out now',
                        outElapsedMinutes: 0,
                        dueInMinutes: null,
                      }
                    : {}),
                  location: newLocationObj,
                }
              : dog;
          }),
        );
        setActionSuccess(
          modalType === 'walk'
            ? 'Walk started successfully.'
            : 'Location updated successfully.',
        );
      }

      if (type === 'behaviorNote') {
        const body = {
          dogs: dogIds,
          text: behaviorNote,
        };

        await createBehaviorNote(body, token);
        setActionSuccess('Behavior note created successfully.');
      }

      // close the modal
      await toggleModalOpen();
      // reset selected dogs
      await setSelectedDogs([]);
      await setNewLocation(null);
    } catch (error) {
      console.error('Error submitting:', error);
      if (error.status === 409) {
        setActionError(
          error.message ||
            'This action conflicted with another update. Data has been refreshed.',
        );
        await fetchDogs();
      } else {
        setActionError(error.message || 'Unable to submit update.');
      }
    }
  };

  const handleLocationChange = async (e) => {
    await setNewLocation(e.target.value);
  };

  const handleBehaviorNoteChange = async (e) => {
    await setBehaviorNote(e.target.value);
  };

  const handleSubmitNote = async (e) => {
    setActionError('');
    setActionSuccess('');
    try {
      const dogIds = selectedDogs.map((selectedDog) => selectedDog._id);
      const body = {
        text: behaviorNote,
        dogs: dogIds,
      };

      await createBehaviorNote(body, token);
      setActionSuccess('Behavior note created successfully.');

      // close the modal
      toggleModalOpen();

      setSelectedDogs([]);
    } catch (error) {
      console.error('Error creating behavior note:', error);
      if (error.status === 409) {
        setActionError(
          error.message ||
            'Conflict detected while creating note. Data has been refreshed.',
        );
        await fetchDogs();
      } else {
        setActionError(error.message || 'Failed to create behavior note.');
      }
    }
  };

  const handleAddDog = async (dogData) => {
    setActionError('');
    setActionSuccess('');
    try {
      const body = {
        name: dogData.name,
        level1: dogData.level1,
        level2: dogData.level2,
        location: dogData.location,
        dob: dogData.dob,
        imageUrl: dogData.imageUrl,
      };

      const newDog = await createDog(body, token);

      // Add the new dog to the dogs list
      let prevDogs = [...dogs, newDog.data];
      setDogs(prevDogs);

      // Close the modal
      setAddDogModalOpen(false);
      setActionSuccess('Dog added successfully.');

      // Show success message (optional)
    } catch (error) {
      console.error('Error adding dog:', error);
      setActionError(error.message || 'Failed to add dog.');
    }
  };

  const handleRemoveDogs = async () => {
    const dogIds = selectedDogs.map((selectedDogs) => selectedDogs._id);
    setActionError('');
    setActionSuccess('');

    try {
      const res = await removeDogs(dogIds, token);
      console.log(res);

      if (res.isSuccessful) {
        // Remove the deleted dogs from the dogs list
        let updatedDogs = dogs.filter((dog) => !dogIds.includes(dog._id));
        setDogs(updatedDogs);

        // Reset selected dogs
        setSelectedDogs([]);
        setActionSuccess('Selected dogs archived successfully.');
      }
    } catch (error) {
      console.error('Error removing dogs:', error);
      if (error.status === 409) {
        setActionError(
          error.message ||
            'Archive conflict detected. Data has been refreshed.',
        );
        await fetchDogs();
      } else {
        setActionError(error.message || 'Failed to archive selected dogs.');
      }
    }
  };

  return (
    <Wrapper>
      {actionError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      ) : null}
      {actionSuccess ? (
        <Alert variant="success" className="mb-4">
          <AlertDescription>{actionSuccess}</AlertDescription>
        </Alert>
      ) : null}

      <MoveDog
        isOpen={moveDogModalOpen}
        toggleOpen={toggleModalOpen}
        type={modalType}
        selectedDogs={selectedDogs}
        handleLocationChange={handleLocationChange}
        handleSubmit={handleSubmit}
        locations={locations}
        handleBehaviorNoteChange={handleBehaviorNoteChange}
        handleSubmitNote={handleSubmitNote}
      />
      <AddDog
        isOpen={addDogModalOpen}
        onClose={() => setAddDogModalOpen(false)}
        onSubmit={handleAddDog}
        locations={locations}
      />
      <div className="flex flex-row justify-between mb-2.5 max-sm:flex-col">
        {hasRole('staff') && (
          <div className="flex gap-1 min-w-[12rem]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddDogModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Dog
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDogs.length == 0}
              onClick={() => handleRemoveDogs()}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between mb-2.5 max-sm:flex-col">
        <div className="w-[35%] max-sm:w-full max-sm:mb-2">
          <div className="relative">
          <Input
            placeholder="Search by name, location, or level..."
            className="h-8 pr-8"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
            {searchQuery ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            ) : null}
          </div>
        </div>
        {hasRole('staff') && (
          <div className="flex gap-1 min-w-[12rem]">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDogs.length == 0}
              onClick={() => toggleModalOpen('move')}
            >
              <ArrowLeftRight className="h-4 w-4 mr-1" />
              Move dog(s)
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDogs.length == 0}
              onClick={() => toggleModalOpen('walk')}
            >
              <Footprints className="h-4 w-4 mr-1" />
              Start walk
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDogs.length == 0}
              onClick={() => toggleModalOpen('behaviorNote')}
            >
              <FileText className="h-4 w-4 mr-1" />
              New Note
            </Button>
          </div>
        )}
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="max-sm:hidden">Out Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchingDogs ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredDogs.length !== 0 ? (
              filteredDogs.map((dog, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) =>
                        handleSelectDog(dog, { target: { checked } })
                      }
                      checked={selectedDogs.some(
                        (selectedDog) => selectedDog._id === dog._id,
                      )}
                      disabled={dog.isWalking}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dogs/${dog._id}`}
                      className="text-primary hover:underline"
                    >
                      {dog.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <LevelIndicator
                      color1={dog.level1}
                      color2={dog.level2}
                      small={true}
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        endingWalkDog == dog._id
                          ? 'animate-pulse bg-muted rounded px-2 py-1'
                          : ''
                      }
                    >
                      {dog.location.name}
                    </span>
                    <div className="mt-1 flex flex-col gap-1 sm:hidden">
                      <span
                        className={`inline-flex w-fit rounded px-2 py-0.5 text-xs font-medium ${getOutStatusClasses(
                          dog.outStatus,
                        )}`}
                      >
                        {dog.outStatusLabel || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dog.outStatus === 'on_walk' &&
                        typeof dog.outElapsedMinutes === 'number'
                          ? `Out ${dog.outElapsedMinutes}m`
                          : typeof dog.outElapsedMinutes === 'number'
                            ? `Out ${dog.outElapsedMinutes}m ago`
                            : 'No recent out'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit rounded px-2 py-0.5 text-xs font-medium ${getOutStatusClasses(
                          dog.outStatus,
                        )}`}
                      >
                        {dog.outStatusLabel || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dog.outStatus === 'on_walk' &&
                        typeof dog.outElapsedMinutes === 'number'
                          ? `Out ${dog.outElapsedMinutes}m`
                          : typeof dog.outElapsedMinutes === 'number'
                            ? `Out ${dog.outElapsedMinutes}m ago`
                            : 'No recent out'}
                      </span>
                      {typeof dog.dueInMinutes === 'number' ? (
                        <span className="text-xs text-muted-foreground">
                          {dog.dueInMinutes <= 0
                            ? 'Due now'
                            : `Due in ${dog.dueInMinutes}m`}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {dog.isWalking ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => submitEndWalk(dog)}
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground max-sm:px-2"
                      >
                        <X className="h-4 w-4 mr-1 max-sm:mr-1" />
                        <span className="max-sm:inline hidden">End</span>
                        <span className="max-sm:hidden">End walk</span>
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex justify-center items-center p-8 text-muted-foreground">
                    No dogs found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Wrapper>
  );
};

const Dogs = () => {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <DogsContent />
    </ProtectedRoute>
  );
};

export default Dogs;
