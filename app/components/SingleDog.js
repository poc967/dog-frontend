'use client';

import styled from 'styled-components';
import { Tabs, Tab, Breadcrumb, Breadcrumbs, Spinner } from '@blueprintjs/core';
import { use, useEffect, useState } from 'react';
import { DOG_HEADER_TABS } from '@/app/constants/constants';
import { toSnakeCase } from '@/app/helpers/helpers';
import { createNote } from '../core/notes';
import { createAlert, deleteWhiteboard } from '../core/dogApi';

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
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [tab, setTab] = useState(null);

  const breadCrumbs = [{ href: '/dogs/', text: 'Dogs' }, { text: dog.name }];

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

  const handleSubmit = async () => {
    if (newNote == '') {
      return;
    }

    const dogs = [dog._id];
    let res = await createNote(newNote, dogs);
    let updatedNotes = [res, ...notes];
    await setNotes(updatedNotes);
    await setNewNote('');
  };

  const handleSubmitWhiteBoard = async () => {
    let res = await createAlert(
      dog._id,
      newWhiteBoardNote,
      newWhiteBoardCategory,
      tab
    );
    let newDog = dog;
    newDog[tab.toLocaleLowerCase()] = res.message;
    await setDog(newDog);
    await setNewWhiteboardNote('');
    await setNewWhiteBoardCategory('');
    await toggleAlertsModalIsOpen();
    await setTab(null);
  };

  const submitDeleteWhiteboard = async (alertId, tab) => {
    let res = await deleteWhiteboard(dog._id, tab, alertId);
    let newDog = {
      ...dog,
      [tab.toLowerCase()]: res.message,
    };
    await setDog(newDog);
  };

  return (
    <main>
      <Wrapper className="bp5-monospace-text">
        <AddAlert
          isOpen={addAlertOpen}
          toggleAlertsModalIsOpen={toggleAlertsModalIsOpen}
          handleNewNoteChange={handleNewNoteChange}
          handleNewCategoryChange={handleNewCategoryChange}
          newWhiteBoardNote={newWhiteBoardNote}
          newWhiteBoardCategory={newWhiteBoardCategory}
          handleSubmitWhiteBoard={handleSubmitWhiteBoard}
          tab={tab}
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
