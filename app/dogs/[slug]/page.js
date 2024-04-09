'use client';

import styled from 'styled-components';
import { Tabs, Tab } from '@blueprintjs/core';
import { useState } from 'react';
import { DOG_HEADER_TABS } from '../../constants/constants';

// components
import DogHeaderCard from '../../components/DogHeaderCard';
import DogDetailTab from '@/app/components/DogDetailTab';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35vw;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

let dog = {
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
};

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <main>
      <Wrapper>
        <DogHeaderCard dog={dog} />

        <Tabs
          selectedTabId="details"
          className="bp5-monospace-text"
          fill={false}
          large={false}
        >
          {DOG_HEADER_TABS.map((tab) => (
            <Tab
              key={tab}
              id={tab.toLocaleLowerCase()}
              title={tab}
              panel={<DogDetailTab dog={dog} />}
            />
          ))}
        </Tabs>
      </Wrapper>
    </main>
  );
};

export default Home;
