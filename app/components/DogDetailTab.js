import {
  Section,
  SectionCard,
  NonIdealState,
  Tag,
  Button,
  Overlay2,
  EditableText,
} from '@blueprintjs/core';
import { DETAIL_CATEGORIES, PRIORITIES } from '../constants/constants';
import { useState } from 'react';

// Components
import Tags from './Tag';

const getRightElement = (num) => (
  <Tag intent="danger" round>
    {num}
  </Tag>
);

const Action = (tab, toggleAlertsModalIsOpen) => (
  <Button
    icon="add"
    text="Add something"
    minimal
    outlined
    small
    intent="none"
    onClick={() => toggleAlertsModalIsOpen(tab)}
  />
);

const Modal = (
  <Overlay2 isOpen={true} usePortal={true} canOutsideClickClose={true} onClose>
    {/* <EditableText /> */}
    <span>Test</span>
  </Overlay2>
);

const DogDetailTab = (props) => {
  const { dog, toggleAlertsModalIsOpen, submitDeleteWhiteboard } = props;
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
          rightElement={
            dog[tab.toLocaleLowerCase()].length == 0
              ? null
              : getRightElement(
                  dog[tab.toLocaleLowerCase()].filter(
                    (alert) => !alert.isDeleted
                  ).length
                )
          }
          compact={true}
        >
          <SectionCard padded={true}>
            {dog[tab.toLocaleLowerCase()].length !== 0 ? (
              <div>
                <div>
                  {PRIORITIES.map((priority, index) => (
                    <div key={index}>
                      {dog[tab.toLowerCase()]
                        .filter((a) => a.priority === priority)
                        .map((alert, index) =>
                          alert && !alert.isDeleted ? (
                            <Tags
                              key={index}
                              alert={alert}
                              tab={tab}
                              submitDeleteWhiteboard={submitDeleteWhiteboard}
                            />
                          ) : null
                        )}
                    </div>
                  ))}
                </div>
                <Tag
                  interactive
                  style={{ marginBottom: '5px', marginLeft: '5px' }}
                  onClick={() => toggleAlertsModalIsOpen(tab)}
                >
                  Add
                </Tag>
              </div>
            ) : (
              <NonIdealState
                title="Nothing to see here!"
                action={Action(tab, toggleAlertsModalIsOpen)}
              />
            )}
          </SectionCard>
        </Section>
      ))}
    </div>
  );
};

export default DogDetailTab;
