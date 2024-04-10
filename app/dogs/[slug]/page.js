'use client';

import styled from 'styled-components';
import { Tabs, Tab } from '@blueprintjs/core';
import { useState } from 'react';
import { DOG_HEADER_TABS } from '../../constants/constants';
import { toSnakeCase } from '@/app/helpers/helpers';

// components
import DogHeaderCard from '../../components/DogHeaderCard';
import DogDetailTab from '@/app/components/DogDetailTab';
import ActivityHistory from '@/app/components/ActivityHistory';
import BehaviorNotes from '@/app/components/BehaviorNotes';
import QRCode from '@/app/components/QRCode';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35vw;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

let dog = {
  id: '123456',
  name: 'Bolognese',
  location: 'Kennel',
  level1: 'green',
  level2: 'yellow',
  image: '/dog.png',
  details: {
    alerts: [
      { data: 'Close guillotine', priority: 'danger' },
      { data: 'Can escape pen 8', priority: 'good' },
      { data: 'Likes cheese', priority: 'good' },
      { data: 'Doesnt like woods', priority: 'info' },
    ],
    diet: [{ data: 'ID Only', priority: 'danger' }],
    behavior: [
      { data: 'Doesnt like dark', priority: 'danger' },
      { data: 'good boy!', priority: 'good' },
    ],
    friends: [],
    medical: [{ data: 'Spay on 2/1', priority: 'info' }],
    misc: [],
  },
  activity_history: [
    { type: 'walk', time: '4/5/2023 4:55p', location: 'side woods' },
    { type: 'walk', time: '4/5/2023 7:00p', location: 'across woods' },
  ],
};

const tabComponentMap = {
  details: DogDetailTab, // Map tab name to component
  activity_history: ActivityHistory,
  behavior_notes: BehaviorNotes,
  qr_code: QRCode,
};

const TabPanelRenderer = ({ tabName, dog }) => {
  const Component = tabComponentMap[toSnakeCase(tabName)]; // Get the component based on tab name
  return Component ? <Component dog={dog} /> : null;
};

const Home = () => {
  const [currentSelectedTab, setCurrentSelectedTab] = useState('details');

  return (
    <main>
      <Wrapper>
        <DogHeaderCard dog={dog} />

        <Tabs
          selectedTabId={currentSelectedTab}
          className="bp5-monospace-text"
          onChange={(e) => setCurrentSelectedTab(e)}
        >
          {DOG_HEADER_TABS.map((tab) => (
            <Tab
              key={tab}
              id={tab.toLocaleLowerCase()}
              title={tab}
              panel={<TabPanelRenderer tabName={tab} dog={dog} />}
            />
          ))}
        </Tabs>
      </Wrapper>
    </main>
  );
};

export default Home;
