import styled from 'styled-components';
import {
  HTMLSelect,
  Overlay2,
  Classes,
  Section,
  SectionCard,
  Icon,
  Button,
} from '@blueprintjs/core';
import { devices } from '../constants/constants';

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

const selectedDogs = ['Niko', 'Bolognese', 'Pumpkin'];

const MoveDog = (props) => {
  return (
    <Overlay2
      isOpen={props.isOpen}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      usePortal={true}
      canOutsideClickClose={true}
      onClose={props.toggleOpen}
    >
      <ModalWrapper className="bp5-monospace-text">
        <Section
          title={'Move Dog(s)'}
          rightElement={
            <Button
              icon="cross"
              outlined={false}
              minimal={true}
              onClick={props.toggleOpen}
            />
          }
        >
          <StyledSectionCard>
            <HTMLSelect minimal={true} fill={true}>
              <option>Pen 9</option>
              <option>Pen 8</option>
              <option>Pen 7</option>
              <option>Pen 6</option>
            </HTMLSelect>
            <Icon
              icon="arrow-down"
              style={{ padding: '0.5rem' }}
              intent="success"
              size={20}
            />
            <HTMLSelect minimal={true} fill={true}>
              <option>Select Destination...</option>
              <option>Pen 9</option>
              <option>Pen 8</option>
              <option>Pen 7</option>
              <option>Pen 6</option>
            </HTMLSelect>
          </StyledSectionCard>
          <SectionCard>
            <StyledButton intent="primary" minimal={true} outlined={true}>
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
