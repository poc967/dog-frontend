'use client';

import {
  Button,
  Checkbox,
  HTMLTable,
  InputGroup,
  ButtonGroup,
  Spinner,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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

const StyledTable = styled(HTMLTable)`
  border: solid #e5e7eb 1px;
  border-radius: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;

  @media ${devices.sm} {
    flex-direction: column;
  }
`;

const SearchWrapper = styled.div`
  width: 35%;

  @media ${devices.sm} {
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
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

  useEffect(() => {
    async function fetchDogs() {
      if (!token) return; // Wait for token to be available

      setFetchingDogs(true);
      try {
        const data = await getDogs(token);
        setDogs(data.message);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setFetchingDogs(false);
      }
    }

    fetchDogs();
  }, [token]);

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
                location: {
                  ...res.data.location,
                  name: res.data.location.name,
                },
              }
            : dog;
        })
      );
      setEndingWalkDog('');
    } catch (error) {
      console.error('Error ending walk:', error);
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
          selectedDogs.filter((selectedDog) => selectedDog.id != dog.id)
        );
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (type) => {
    const dogIds = selectedDogs.map((selectedDog) => selectedDog._id);

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
            return dogIds.includes(dog._id)
              ? {
                  ...dog,
                  isWalking: modalType === 'walk' ? true : false,
                  location: newLocationObj,
                }
              : dog;
          })
        );
      }

      if (type === 'behaviorNote') {
        const body = {
          dogs: dogIds,
          text: behaviorNote,
        };

        await createBehaviorNote(body, token);
      }
    } catch (error) {
      console.error('Error submitting:', error);
    }

    // close the modal
    await toggleModalOpen();
    // reset selected dogs
    await setSelectedDogs([]);
    await setNewLocation(null);
  };

  const handleLocationChange = async (e) => {
    await setNewLocation(e.target.value);
  };

  const handleBehaviorNoteChange = async (e) => {
    await setBehaviorNote(e.target.value);
  };

  const handleSubmitNote = async (e) => {
    try {
      const dogIds = selectedDogs.map((selectedDog) => selectedDog._id);
      const body = {
        text: behaviorNote,
        dogs: dogIds,
      };

      await createBehaviorNote(body, token);

      // close the modal
      toggleModalOpen();

      setSelectedDogs([]);
    } catch (error) {
      console.error('Error creating behavior note:', error);
    }
  };

  const handleAddDog = async (dogData) => {
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

      // Show success message (optional)
      console.log('Dog added successfully', newDog);
    } catch (error) {
      console.error('Error adding dog:', error);
    }
  };

  return (
    <Wrapper>
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
      <InputWrapper>
        {hasRole('staff') && (
          <ButtonGroup style={{ minWidth: '12rem' }}>
            <Button
              text={includeButtonNames ? 'Add Dog' : null}
              icon="plus"
              small={true}
              outlined={true}
              fill={!includeButtonNames}
              onClick={() => setAddDogModalOpen(true)}
            />
            <Button
              text={includeButtonNames ? 'Archive' : null}
              icon="archive"
              small={true}
              outlined={true}
              fill={!includeButtonNames}
              disabled={true}
            />
          </ButtonGroup>
        )}
      </InputWrapper>
      <InputWrapper>
        <SearchWrapper>
          <InputGroup small={true} placeholder="Search..." />
        </SearchWrapper>
        {hasRole('staff') && (
          <ButtonGroup style={{ minWidth: '12rem' }}>
            <Button
              text={includeButtonNames ? 'Move dog(s)' : null}
              icon="changes"
              small={true}
              outlined={true}
              fill={!includeButtonNames}
              disabled={selectedDogs.length == 0}
              onClick={() => toggleModalOpen('move')}
            />
            <Button
              text={includeButtonNames ? 'Start walk' : null}
              icon="walk"
              small={true}
              outlined={true}
              fill={!includeButtonNames}
              disabled={selectedDogs.length == 0}
              onClick={() => toggleModalOpen('walk')}
            />
            <Button
              text={includeButtonNames ? 'New Behavior Note' : null}
              icon="git-repo"
              small={true}
              outlined={true}
              fill={!includeButtonNames}
              disabled={selectedDogs.length == 0}
              onClick={() => toggleModalOpen('behaviorNote')}
            />
          </ButtonGroup>
        )}
      </InputWrapper>
      <StyledTable className="bp5-html-table-striped">
        {includeButtonNames ? (
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Level</th>
              <th>Location</th>
              {/* <th>Last Out</th> */}
              <th></th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {fetchingDogs ? (
            <tr>
              <td colSpan={includeButtonNames ? 6 : 1}>
                <LoadingContainer>
                  <Spinner size={40} />
                </LoadingContainer>
              </td>
            </tr>
          ) : dogs.length !== 0 ? (
            dogs.map((dog, index) => (
              <tr key={index}>
                <td>
                  <Checkbox
                    onChange={(e) => handleSelectDog(dog, e)}
                    checked={selectedDogs[dog._id]}
                    disabled={dog.isWalking}
                  />
                </td>
                <td>
                  <Link href={`/dogs/${dog._id}`}>{dog.name}</Link>
                </td>
                <td valign="middle">
                  <LevelIndicator
                    color1={dog.level1}
                    color2={dog.level2}
                    small={true}
                  />
                </td>
                <td>
                  <span
                    className={`${
                      endingWalkDog == dog._id ? 'bp5-skeleton' : null
                    }`}
                  >
                    {dog.location.name}
                  </span>
                </td>
                {/* <td>2:15</td> */}
                <td>
                  {dog.isWalking ? (
                    <Button
                      text={includeButtonNames ? 'End walk' : null}
                      icon="cross"
                      small={true}
                      outlined={true}
                      fill={!includeButtonNames}
                      onClick={() => submitEndWalk(dog)}
                      intent="danger"
                    />
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={includeButtonNames ? 6 : 1}>
                <LoadingContainer>No dogs found</LoadingContainer>
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>
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
