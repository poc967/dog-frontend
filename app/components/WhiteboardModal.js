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
  Drawer,
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

const AddAlert = (props) => {
  const {
    type,
    selectedDogs,
    handleSubmit,
    handleLocationChange,
    locations,
    toggleAlertsModalIsOpen,
    handleNewCategoryChange,
    handleNewNoteChange,
    newWhiteBoardCategory,
    newWhiteBoardNote,
    handleSubmitWhiteBoard,
  } = props;

  return (
    <Overlay2
      isOpen={props.isOpen}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      usePortal={true}
      canOutsideClickClose={true}
      onClose={() => toggleAlertsModalIsOpen()}
      position="bottom"
    >
      <ModalWrapper>
        <Section
          title="Add Alert"
          rightElement={
            <Button
              icon="cross"
              outlined={false}
              minimal={true}
              onClick={() => toggleAlertsModalIsOpen()}
            />
          }
        >
          <StyledSectionCard>
            <input
              type="text"
              class="bp5-input"
              style={{ width: '100%', marginBottom: '1rem' }}
              placeholder="Shy! Go Slow"
              value={newWhiteBoardNote}
              onChange={(e) => handleNewNoteChange(e)}
            />
            <HTMLSelect
              class="bp5-html-select"
              fill={true}
              onChange={(e) => handleNewCategoryChange(e)}
            >
              <option>Select a Category...</option>
              <option value="good">Good</option>
              <option value="info">Info</option>
              <option value="danger">Alert</option>
            </HTMLSelect>
          </StyledSectionCard>
          <SectionCard>
            <StyledButton
              intent="primary"
              minimal={true}
              outlined={true}
              onClick={() => handleSubmitWhiteBoard()}
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

export default AddAlert;
