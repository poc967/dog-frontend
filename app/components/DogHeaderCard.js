import {
  Card,
  Overlay2,
  OverlaysProvider,
  Classes,
  Icon,
} from '@blueprintjs/core';
import Image from 'next/image';
import styled from 'styled-components';
import { useState } from 'react';

// components
import LevelIndicator from './LevelIndicator';

const CardDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const ModalWrapper = styled.div`
  left: calc(50vw - 175px);
  margin: 10vh 0;
  top: 0;
  width: 400px;
`;

const DogHeaderCard = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card style={{ padding: '10px', marginBottom: '1rem' }}>
      <CardDataWrapper>
        <Image
          src={props.dog.imageUrl || '/dog.png'}
          width={115}
          height={115}
          style={{ borderRadius: '3px' }}
          alt="image of dog"
          onClick={toggleIsOpen}
        />
        <OverlaysProvider>
          <Overlay2
            className={Classes.OVERLAY_SCROLL_CONTAINER}
            isOpen={isOpen}
            usePortal={true}
            onClose={toggleIsOpen}
            canOutsideClickClose={true}
          >
            <ModalWrapper>
              <Image
                src={props.dog.imageUrl || '/dog.png'}
                width={350}
                height={350}
                alt="image of dog"
              />
            </ModalWrapper>
          </Overlay2>
        </OverlaysProvider>
        <div style={{ paddingLeft: '15px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h3 className="bp5-heading" style={{ marginRight: '7px' }}>
              {props.dog.name}
            </h3>
            <LevelIndicator
              color1={props.dog.level1}
              color2={props.dog.level2}
            />
          </div>
          <Icon
            icon="map-marker"
            style={{ paddingRight: '5px' }}
            intent="danger"
          />
          <span style={{ size: '1.5rem' }}>{props.dog.location.name}</span>
        </div>
      </CardDataWrapper>
    </Card>
  );
};

export default DogHeaderCard;
