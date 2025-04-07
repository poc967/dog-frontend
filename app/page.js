'use client';

import Image from 'next/image';
import styled from 'styled-components';
import {
  Card,
  Section,
  SectionCard,
  NonIdealState,
  Button,
  Tag,
  Tabs,
  Tab,
} from '@blueprintjs/core';
import { useState } from 'react';
import { DETAIL_TABS } from './constants/constants';

// components
import Tags from './components/Tag';
import LevelIndicator from './components/LevelIndicator';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 35vw;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const CardDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Action = (
  <Button
    icon="add"
    text="Add something"
    minimal
    outlined
    small
    intent="none"
  />
);

const getRightElement = (num) => (
  <Tag intent="danger" round>
    {num}
  </Tag>
);

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
        <Card style={{ padding: '10px', marginBottom: '1rem' }}>
          <CardDataWrapper>
            <Image
              src={dog.image}
              width={115}
              height={115}
              style={{ borderRadius: '3px' }}
              alt="image of dog"
            />
            <div style={{ paddingLeft: '15px' }}>
              <h3 className="bp5-heading">{dog.name}</h3>
              <LevelIndicator color1={dog.level1} color2={dog.level2} />
              <h4 className="bp5-heading">location: {dog.location}</h4>
            </div>
          </CardDataWrapper>
        </Card>

        <Tabs selectedTabId="det" fill={false} large={false}>
          <Tab id="det" title="Details" />
          <Tab title="Activity History" />
          <Tab title="Behavior Notes" />
          <Tab title="QR Code" />
        </Tabs>

        {DETAIL_TABS.map((tab, index) => (
          <Section
            key={index}
            collapsible={true}
            title={tab}
            rightElement={
              dog['details'][tab.toLocaleLowerCase()].length == 0
                ? null
                : getRightElement(
                    dog['details'][tab.toLocaleLowerCase()].length
                  )
            }
          >
            <SectionCard padded={true}>
              {dog['details'][tab.toLocaleLowerCase()].length !== 0 ? (
                <div>
                  <div>
                    {dog['details'][tab.toLowerCase()]
                      .filter((a) => a.priority === 'danger')
                      .map((alert, index) =>
                        alert ? <Tags key={index} alert={alert} /> : null
                      )}
                  </div>
                  <div>
                    {dog['details'][tab.toLowerCase()]
                      .filter((a) => a.priority === 'good')
                      .map((alert, index) =>
                        alert ? <Tags key={index} alert={alert} /> : null
                      )}
                  </div>
                  <div>
                    {dog['details'][tab.toLowerCase()]
                      .filter((a) => a.priority === 'info')
                      .map((alert, index) =>
                        alert ? <Tags key={index} alert={alert} /> : null
                      )}
                  </div>
                </div>
              ) : (
                <NonIdealState title="Nothing to see here!" action={Action} />
              )}
            </SectionCard>
          </Section>
        ))}
      </Wrapper>
    </main>
  );
};

export default Home;
