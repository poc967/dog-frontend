'use client';

import axios from 'axios';

import {
  Button,
  Checkbox,
  HTMLTable,
  InputGroup,
  ButtonGroup,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// components
import LevelIndicator from '../components/LevelIndicator';
import MoveDog from '../components/MoveDog';
import EndWalk from '../components/EndWalk';
import { devices } from '../constants/constants';
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

const Dogs = () => {
  const [domSize, setDomSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [includeButtonNames, setIncludeButtonNames] = useState(false);
  const [moveDogModalOpen, setMoveDogModalOpen] = useState(false);
  const [endWalkModalOpen, setEndWalkModalOpen] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState([]);
  const [fetchingDogs, setFetchingDogs] = useState(false);
  const [dogs, setDogs] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [endingWalkDog, setEndingWalkDog] = useState('');
  const [modalType, setModalType] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [behaviorNote, setBehaviorNote] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setDomSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Check if the DOM size meets a certain condition
    if (domSize.width > 910) {
      // Update component state accordingly
      setIncludeButtonNames(true);
    } else {
      setIncludeButtonNames(false);
    }
  }, [domSize]);

  useEffect(() => {
    async function fetchDogs() {
      let res = await axios.get('http://localhost:8080/dog');
      setDogs(res.data.message);
    }

    fetchDogs();
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      let res = await fetch(`http://localhost:8080/settings/location`, {
        cache: 'no-store',
      });
      let locations = await res.json();
      setLocations(locations.data);
    }

    fetchLocations();
  }, []);

  const toggleModalOpen = async (type) => {
    if (!moveDogModalOpen == true) {
      await setModalType(type);
    } else {
      setModalType(null);
    }
    await setMoveDogModalOpen(!moveDogModalOpen);
  };

  const submitEndWalk = async (dogToUpdate) => {
    await setEndingWalkDog(dogToUpdate._id);
    let data = {
      dogIds: [dogToUpdate._id],
    };
    let res = await axios.put(
      'http://localhost:8080/activity/complete-walk',
      data
    );

    if (res.status == 200) {
      await setDogs(
        dogs.map((dog) => {
          return dog._id == dogToUpdate._id
            ? {
                ...dog,
                isWalking: false,
                location: {
                  ...res.data.data.location,
                  name: res.data.data.location.name,
                },
              }
            : dog;
        })
      );
      await setEndingWalkDog('');
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
    let body;
    let dogIds = selectedDogs.map((selectedDog) => selectedDog._id);

    if (type === 'walk' || type === 'move') {
      body = {
        location: newLocation,
        type: modalType,
        dogs: dogIds,
      };
      let res = await axios.post('http://localhost:8080/activity', body);
      if (res.status == 200) {
        // update dogs state with new location
        function getLocationObject() {
          let obj = locations.find((item) => item._id === newLocation);
          return obj;
        }

        let newLocationObj = getLocationObject();

        await setDogs(
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
    }

    if (type === 'behaviorNote') {
      body = {
        dogs: dogIds,
        text: behaviorNote,
      };

      let res = await axios.post('http://localhost:8080/note/new', body);
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
    let dogIds = selectedDogs.map((selectedDog) => selectedDog._id);
    let body = {
      text: behaviorNote,
      dogs: dogIds,
    };

    let res = await axios.post('http://localhost:8080/note/new');

    // close the modal
    await toggleModalOpen();

    await setSelectedDogs([]);
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
      <InputWrapper>
        <ButtonGroup style={{ minWidth: '12rem' }}>
          <Button
            text={includeButtonNames ? 'Add Dog' : null}
            icon="plus"
            small={true}
            outlined={true}
            fill={!includeButtonNames}
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
      </InputWrapper>
      <InputWrapper>
        <SearchWrapper>
          <InputGroup small={true} placeholder="Search..." />
        </SearchWrapper>
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
      </InputWrapper>
      <StyledTable className="bp5-html-table-striped">
        {includeButtonNames ? (
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Level</th>
              <th>Location</th>
              <th>Last Out</th>
              <th></th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {dogs.length !== 0
            ? dogs.map((dog, index) => (
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
                  <td>2:15</td>
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
            : null}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
};

export default Dogs;
