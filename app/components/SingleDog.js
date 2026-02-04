'use client';

import styled from 'styled-components';
import { Tabs, Tab, Breadcrumb, Breadcrumbs, Spinner } from '@blueprintjs/core';
import { use, useEffect, useState } from 'react';
import { DOG_HEADER_TABS } from '@/app/constants/constants';
import { toSnakeCase } from '@/app/helpers/helpers';
import { createNote } from '../api/notes';
import { createAlert, deleteWhiteboard, getDogs, addFriend, deleteFriend } from '../api/dog';

// components
import DogHeaderCard from '@/app/components/DogHeaderCard';
import DogDetailTab from '@/app/components/DogDetailTab';
import ActivityHistory from '@/app/components/ActivityHistory';
import BehaviorNotes from '@/app/components/BehaviorNotes';
import QRCode from '@/app/components/QRCode';
import { devices } from '@/app/constants/constants';
import AddAlert from './WhiteboardModal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35vw;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media ${devices['2xl']} {
    width: 45vw;
  }
  @media ${devices.xl} {
    width: 45vw;
  }
  @media ${devices.lg} {
    width: 80vw;
  }
  @media ${devices.md} {
    width: 95vw;
  }
  @media ${devices.xs} {
    width: 95vw;
  }
  @media ${devices.sm} {
    width: 95vw;
  }
`;

const StyledTabs = styled(Tabs)`
  ul {
    overflow-y: scroll;
  }
`;

const tabComponentMap = {
  details: DogDetailTab, // Map tab name to component
  activity_history: ActivityHistory,
  behavior_notes: BehaviorNotes,
  qr_code: QRCode,
};

const TabPanelRenderer = ({
  tabName,
  dog,
  activityHistory,
  notes,
  handleChange,
  handleSubmit,
  newNote,
  toggleAlertsModalIsOpen,
  submitDeleteWhiteboard,
  allDogs,
}) => {
  const Component = tabComponentMap[toSnakeCase(tabName)]; // Get the component based on tab name
  return Component ? (
    <Component
      dog={dog}
      activityHistory={activityHistory}
      notes={notes}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      newNote={newNote}
      toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
      submitDeleteWhiteboard={submitDeleteWhiteboard}
      allDogs={allDogs}
    />
  ) : null;
};

const renderCurrentBreadcrumb = ({ text, ...restProps }) => {
  return <Breadcrumb {...restProps}>{text}</Breadcrumb>;
};

const SingleDog = (props) => {
  const [currentSelectedTab, setCurrentSelectedTab] = useState('details');
  const [dog, setDog] = useState(props.dog.dog);
  const [activityHistory, setActivityHistory] = useState(props.activityHistory);
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newWhiteBoardNote, setNewWhiteboardNote] = useState('');
  const [newWhiteBoardCategory, setNewWhiteBoardCategory] = useState('');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [tab, setTab] = useState(null);
  const [allDogs, setAllDogs] = useState([]);

  const breadCrumbs = [{ href: '/dogs/', text: 'Dogs' }, { text: dog.name }];

  useEffect(() => {
    const fetchAllDogs = async () => {
      if (!props.token) return;

      try {
        const data = await getDogs(props.token);
        // Filter out the current dog
        const otherDogs = data.message.filter((d) => d._id !== dog._id);
        setAllDogs(otherDogs);
      } catch (error) {
        console.error('Error fetching all dogs:', error);
      }
    };

    fetchAllDogs();
  }, [props.token, dog._id]);

  const handleChange = async (e) => {
    await setNewNote(e.target.value);
  };

  const toggleAlertsModalIsOpen = async (currentTab) => {
    await setAddAlertOpen(!addAlertOpen);
    await setTab(currentTab);
  };

  const handleNewNoteChange = async (e) => {
    await setNewWhiteboardNote(e.target.value);
  };

  const handleNewCategoryChange = async (e) => {
    await setNewWhiteBoardCategory(e.target.value);
  };

  const handleFriendChange = async (e) => {
    await setSelectedFriend(e.target.value);
  };

  const handleSubmit = async () => {
    if (newNote == '') {
      return;
    }

    const dogs = [dog._id];
    let res = await createNote(newNote, dogs, props.token);
    let updatedNotes = [res, ...notes];
    await setNotes(updatedNotes);
    await setNewNote('');
  };

  const handleSubmitWhiteBoard = async () => {
    if (tab === 'Friends') {
      // For Friends tab, only need to select a friend
      if (!selectedFriend) {
        return;
      }

      // Use the specific friends API endpoint
      let res = await addFriend(dog._id, selectedFriend, props.token);
      let newDog = { ...dog };
      newDog.friends = res.data.friends;
      await setDog(newDog);
      console.log('Added friend:', newDog);
    } else {
      // For other tabs, validate that both note and category are selected
      if (!newWhiteBoardNote.trim() || !newWhiteBoardCategory) {
        return;
      }

      // Use the regular alert API
      let res = await createAlert(
        dog._id,
        newWhiteBoardNote,
        newWhiteBoardCategory,
        tab,
        props.token
      );
      let newDog = dog;
      newDog[tab.toLocaleLowerCase()] = res.message;
      await setDog(newDog);
    }

    await setNewWhiteboardNote('');
    await setNewWhiteBoardCategory('');
    await setSelectedFriend('');
    await toggleAlertsModalIsOpen();
    await setTab(null);
  };

  const submitDeleteWhiteboard = async (alertId, tab) => {
    let res;
    
    if (tab === 'Friends') {
      // For Friends, use the deleteFriend API with the friend's ID
      res = await deleteFriend(dog._id, alertId, props.token);
      let newDog = {
        ...dog,
        friends: res.data.friends, // Use the updated friends array from the response
      };
      await setDog(newDog);
    } else {
      // For other tabs, use the regular deleteWhiteboard API
      res = await deleteWhiteboard(dog._id, tab, alertId, props.token);
      let newDog = {
        ...dog,
        [tab.toLowerCase()]: res.message,
      };
      await setDog(newDog);
    }
  };

  return (
    <main>
      <Wrapper>
        <AddAlert
          isOpen={addAlertOpen}
          toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
          handleNewNoteChange={handleNewNoteChange}
          handleNewCategoryChange={handleNewCategoryChange}
          handleFriendChange={handleFriendChange}
          newWhiteBoardNote={newWhiteBoardNote}
          newWhiteBoardCategory={newWhiteBoardCategory}
          selectedFriend={selectedFriend}
          handleSubmitWhiteBoard={handleSubmitWhiteBoard}
          tab={tab}
          allDogs={allDogs}
        />
        <div style={{ marginBottom: '0.5rem' }}>
          <Breadcrumbs
            currentBreadcrumbRenderer={renderCurrentBreadcrumb}
            items={breadCrumbs}
          />
        </div>
        <DogHeaderCard dog={dog} />
        <StyledTabs
          selectedTabId={currentSelectedTab}
          onChange={(e) => setCurrentSelectedTab(e)}
          style={{ overflowY: 'scroll' }}
        >
          {DOG_HEADER_TABS.map((tab) => (
            <Tab
              key={tab}
              id={tab.toLocaleLowerCase()}
              title={tab}
              panel={
                <TabPanelRenderer
                  tabName={tab}
                  dog={dog}
                  activityHistory={activityHistory}
                  notes={notes}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  newNote={newNote}
                  toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
                  handleNewNoteChange={handleNewNoteChange}
                  handleNewCategoryChange={handleNewCategoryChange}
                  submitDeleteWhiteboard={submitDeleteWhiteboard}
                  allDogs={allDogs}
                />
              }
            />
          ))}
        </StyledTabs>
      </Wrapper>
    </main>
  );
};

export default SingleDog;
