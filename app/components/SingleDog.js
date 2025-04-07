'use client';

import styled from 'styled-components';
import { Tabs, Tab, Breadcrumb, Breadcrumbs, Spinner } from '@blueprintjs/core';
import { use, useEffect, useState } from 'react';
import { DOG_HEADER_TABS } from '@/app/constants/constants';
import { toSnakeCase } from '@/app/helpers/helpers';
import { createNote } from '../core/notes';

// components
import DogHeaderCard from '@/app/components/DogHeaderCard';
import DogDetailTab from '@/app/components/DogDetailTab';
import ActivityHistory from '@/app/components/ActivityHistory';
import BehaviorNotes from '@/app/components/BehaviorNotes';
import QRCode from '@/app/components/QRCode';
import { devices } from '@/app/constants/constants';

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

  const breadCrumbs = [{ href: '/dogs/', text: 'Dogs' }, { text: dog.name }];

  const handleChange = async (e) => {
    console.log(e.target.value);

    await setNewNote(e.target.value);
  };

  const handleSubmit = async () => {
    console.log('submitting....', newNote);
    if (newNote == '') {
      return;
    }

    const dogs = [dog._id];
    let res = await createNote(newNote, dogs);
    let updatedNotes = [res, ...notes];
    console.log(updatedNotes);
    await setNotes(updatedNotes);
    await setNewNote('');
  };

  return (
    <main>
      <Wrapper className="bp5-monospace-text">
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
