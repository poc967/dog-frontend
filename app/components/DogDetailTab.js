import {
  Section,
  SectionCard,
  NonIdealState,
  Tag,
  Button,
} from '@blueprintjs/core';
import { DETAIL_CATEGORIES } from '../constants/constants';
import { useState } from 'react';

const getRightElement = (num) => (
  <Tag intent="danger" round>
    {num}
  </Tag>
);

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

// Components
import Tags from './Tag';

const DogDetailTab = (props) => {
  const { dog } = props;
  const [alertsIsOpen, setAlertsIsOpen] = useState(true);
  const [dietIsOpen, setDietIsOpen] = useState(false);
  const [behaviorIsOpen, setBehaviorIsOpen] = useState(false);
  const [friendsIsOpen, setFriendsIsOpen] = useState(false);
  const [miscIsOpen, setMiscIsOpen] = useState(false);

  const toggleAlertsIsOpen = () => {
    setAlertsIsOpen(!alertsIsOpen);
  };

  const toggleDietIsOpen = () => {
    setDietIsOpen(!dietIsOpen);
  };

  const toggleBehaviorIsOpen = () => {
    setBehaviorIsOpen(!behaviorIsOpen);
  };

  const toggleFriendsIsOpen = () => {
    setFriendsIsOpen(!friendsIsOpen);
  };

  const toggleMiscIsOpen = () => {
    setMiscIsOpen(!miscIsOpen);
  };

  const stateMap = {
    Alerts: alertsIsOpen,
    Diet: dietIsOpen,
    Behavior: behaviorIsOpen,
    Friends: friendsIsOpen,
    Misc: miscIsOpen,
  };
  const functionMap = {
    Alerts: toggleAlertsIsOpen,
    Diet: toggleDietIsOpen,
    Behavior: toggleBehaviorIsOpen,
    Friends: toggleFriendsIsOpen,
    Misc: toggleMiscIsOpen,
  };

  return (
    <div>
      {DETAIL_CATEGORIES.map((tab, index) => (
        <Section
          key={index}
          collapsible={true}
          collapseProps={{
            isOpen: stateMap[tab],
            onToggle: functionMap[tab],
          }}
          title={tab}
          className="bp5-monospace-text"
          rightElement={
            dog['details'][tab.toLocaleLowerCase()].length == 0
              ? null
              : getRightElement(dog['details'][tab.toLocaleLowerCase()].length)
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
    </div>
  );
};

export default DogDetailTab;
