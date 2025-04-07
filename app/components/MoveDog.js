'use client';

import styled from 'styled-components';
import {
  HTMLSelect,
  Overlay2,
  Classes,
  Section,
  SectionCard,
  Button,
  Tag,
} from '@blueprintjs/core';
import { devices } from '../constants/constants';
import { useState, useEffect } from 'react';

const ModalWrapper = styled.div`
  left: calc(50vw - 17vw);
  margin: 10vh 0;
  top: 0;
  width: 33vw;

  @media ${devices['2xl']} {
    width: 33vw;
  }
  @media ${devices.xl} {
    width: 33vw;
  }
  @media ${devices.lg} {
    width: 50vw;
    left: calc(50vw - 22vw);
  }
  @media ${devices.md} {
    width: 95vw;
    left: calc(50vw - 47vw);
  }
  @media ${devices.sm} {
    width: 95vw;
    left: calc(50vw - 47vw);
  }
  @media ${devices.xs} {
    width: 95vw;
    left: calc(50vw - 47vw);
  }
`;

const StyledSectionCard = styled(SectionCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
`;

const NamesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: 7px;
`;

const MoveDog = (props) => {
  const {
    type,
    selectedDogs,
    handleSubmit,
    handleLocationChange,
    locations,
    handleBehaviorNoteChange,
  } = props;

  const NamesContainerFragment = (
    <NamesContainer>
      {selectedDogs
        ? selectedDogs.map((d, index) => (
            <Tag
              intent="primary"
              key={index}
              large
              style={{ marginLeft: '5px' }}
            >
              {d.name}
            </Tag>
          ))
        : null}
    </NamesContainer>
  );

  let content;
  switch (type) {
    case 'move':
      content = (
        <>
          {NamesContainerFragment}
          <HTMLSelect
            minimal={true}
            fill={true}
            onChange={(e) => handleLocationChange(e)}
          >
            <option>Select Destination...</option>
            {locations
              .filter((location) => {
                return !('walkable' in location) || location.walkable == false;
              })
              .map((location, index) => (
                <option key={index} value={location._id}>
                  {location.name}
                </option>
              ))}
          </HTMLSelect>
        </>
      );
      break;
    case 'walk':
      content = (
        <>
          {NamesContainerFragment}
          <HTMLSelect
            minimal={true}
            fill={true}
            onChange={(e) => handleLocationChange(e)}
          >
            <option>Walk Destination...</option>
            {locations
              .filter((location) => {
                return location.walkable;
              })
              .map((location, index) => (
                <option key={index} value={location._id}>
                  {location.name}
                </option>
              ))}
          </HTMLSelect>
        </>
      );
      break;
    case 'behaviorNote':
      content = (
        <>
          {NamesContainerFragment}
          <textarea
            class="bp5-input bp5-fill"
            onChange={(e) => handleBehaviorNoteChange(e)}
          ></textarea>
        </>
      );
      break;
    default:
      content = null;
  }

  return (
    <Overlay2
      isOpen={props.isOpen}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      usePortal={true}
      canOutsideClickClose={true}
      onClose={props.toggleOpen}
    >
      <ModalWrapper>
        <Section
          title={() => getTitle()}
          rightElement={
            <Button
              icon="cross"
              outlined={false}
              minimal={true}
              onClick={props.toggleOpen}
            />
          }
        >
          <StyledSectionCard>{content}</StyledSectionCard>
          <SectionCard>
            <StyledButton
              intent="primary"
              minimal={true}
              outlined={true}
              onClick={() => handleSubmit(type)}
            >
              Submit
            </StyledButton>
            <StyledButton
              intent="danger"
              minimal={true}
              outlined={true}
              onClick={props.toggleOpen}
            >
              Cancel
            </StyledButton>
          </SectionCard>
        </Section>
      </ModalWrapper>
    </Overlay2>
  );
};

export default MoveDog;
