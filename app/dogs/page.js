'use client';

import {
  Button,
  Checkbox,
  HTMLTable,
  InputGroup,
  ButtonGroup,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

// components
import LevelIndicator from '../components/LevelIndicator';
import { devices } from '../constants/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;

  @media ${devices.sm} {
    width: 95vw;
  }
  @media ${devices.md} {
    width: 95vw;
  }
  @media ${devices.xs} {
    width: 95vw;
  }
  @media ${devices.lg} {
    width: 80vw;
  }
  @media ${devices.xl} {
    width: 80vw;
  }
`;

let dogs = [
  {
    id: '12345',
    name: 'Bolognese',
    location: 'Kennel',
    level1: 'green',
    level2: 'yellow',
    image: '/dog.png',
  },
  {
    id: '123457',
    name: 'Scoop',
    location: 'Kennel',
    level1: 'green',
    image: '/dog.png',
  },
  {
    id: '12345678',
    name: 'Niko',
    location: 'Kennel',
    level1: 'blue',
    image: '/dog.png',
  },
  {
    id: '123456',
    name: 'Millie',
    location: 'Kennel',
    level1: 'yellow',
    image: '/dog.png',
  },
  {
    id: '123456',
    name: 'Pumpkin',
    location: 'Kennel',
    level1: 'green',
    level2: 'yellow',
    image: '/dog.png',
  },
];

const StyledTable = styled(HTMLTable)`
  border: solid #e5e7eb 1px;
  border-radius: 5px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SearchWrapper = styled.div`
  width: 25%;
`;
const Dogs = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <InputWrapper>
        <SearchWrapper>
          <InputGroup
            className="bp5-monospace-text"
            small={true}
            placeholder="Search..."
          />
        </SearchWrapper>
        <ButtonGroup className="bp5-monospace-text">
          <Button text="Move dog" icon="changes" small={true} />
          <Button text="Start walk" icon="walk" small={true} />
          <Button text="New Behavior Note" icon="git-repo" small={true} />
        </ButtonGroup>
      </InputWrapper>
      <StyledTable
        interactive={true}
        className="bp5-monospace-text"
        compact={true}
      >
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Level</th>
            <th>Location</th>
            <th>Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {dogs.map((dog, index) => (
            <tr key={index} onClick={() => router.push(`/dogs/${dog.id}`)}>
              <td>
                <Checkbox />
              </td>
              <td>{dog.name}</td>
              <td valign="middle">
                <LevelIndicator
                  color1={dog.level1}
                  color2={dog.level2}
                  compact={true}
                />
              </td>
              <td>{dog.location}</td>
              <td>2hr 15min</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
};

export default Dogs;
