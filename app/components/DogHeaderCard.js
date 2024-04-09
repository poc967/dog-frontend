import { Card } from '@blueprintjs/core';
import Image from 'next/image';
import styled from 'styled-components';

// components
import LevelIndicator from './LevelIndicator';

const CardDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const DogHeaderCard = (props) => {
  return (
    <Card style={{ padding: '10px', marginBottom: '1rem' }}>
      <CardDataWrapper>
        <Image
          src={props.dog.image}
          width={115}
          height={115}
          style={{ borderRadius: '3px' }}
          alt="image of dog"
        />
        <div style={{ paddingLeft: '15px' }}>
          <h3 className="bp5-heading bp5-monospace-text">{props.dog.name}</h3>
          <LevelIndicator color1={props.dog.level1} color2={props.dog.level2} />
          <h4 className="bp5-heading bp5-monospace-text">
            location: {props.dog.location}
          </h4>
        </div>
      </CardDataWrapper>
    </Card>
  );
};

export default DogHeaderCard;
