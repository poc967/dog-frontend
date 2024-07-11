'use client';

import styled from 'styled-components';
import { Tabs, Tab, Breadcrumb, Breadcrumbs } from '@blueprintjs/core';
import { useState } from 'react';
import { DOG_HEADER_TABS } from '@/app/constants/constants';
import { toSnakeCase } from '@/app/helpers/helpers';

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

const TabPanelRenderer = ({ tabName, dog }) => {
  const Component = tabComponentMap[toSnakeCase(tabName)]; // Get the component based on tab name
  return Component ? <Component dog={dog} /> : null;
};

const renderCurrentBreadcrumb = ({ text, ...restProps }) => {
  return <Breadcrumb {...restProps}>{text}</Breadcrumb>;
};

const SingleDog = (props) => {
  const { dog } = props;
  const [currentSelectedTab, setCurrentSelectedTab] = useState('details');

  const breadCrumbs = [
    { href: '/dogs/', text: 'Dogs' },
    { text: dog.dog.name },
  ];

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
          className="bp5-monospace-text"
          onChange={(e) => setCurrentSelectedTab(e)}
          style={{ overflowY: 'scroll' }}
        >
          {DOG_HEADER_TABS.map((tab) => (
            <Tab
              key={tab}
              id={tab.toLocaleLowerCase()}
              title={tab}
              panel={<TabPanelRenderer tabName={tab} dog={dog} />}
            />
          ))}
        </StyledTabs>
      </Wrapper>
    </main>
  );
};

export default SingleDog;
