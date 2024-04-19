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
import { useState, useEffect } from 'react';

// components
import LevelIndicator from '../components/LevelIndicator';
import { devices } from '../constants/constants';
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 75vw;

  @media ${devices['2xl']} {
    width: 75vw;
  }
  @media ${devices.xl} {
    width: 80vw;
  }
  @media ${devices.lg} {
    width: 80vw;
  }
  @media ${devices.md} {
    width: 95vw;
  }
  @media ${devices.sm} {
    width: 95vw;
  }
  @media ${devices.xs} {
    width: 95vw;
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

  @media ${devices.sm} {
    flex-direction: column;
  }
`;

const SearchWrapper = styled.div`
  width: 35%;

  @media ${devices.sm} {
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;
const Dogs = () => {
  const [domSize, setDomSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [includeButtonNames, setIncludeButtonNames] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setDomSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Check if the DOM size meets a certain condition
    if (domSize.width > 910) {
      // Update component state accordingly
      setIncludeButtonNames(true);
    } else {
      setIncludeButtonNames(false);
    }
  }, [domSize]);

  return (
    <Wrapper>
      <InputWrapper>
        <ButtonGroup
          className="bp5-monospace-text"
          style={{ minWidth: '12rem' }}
        >
          <Button
            text={includeButtonNames ? 'Add Dog' : null}
            icon="plus"
            small={true}
            outlined={true}
            fill={!includeButtonNames}
          />
          <Button
            text={includeButtonNames ? 'Archive' : null}
            icon="archive"
            small={true}
            outlined={true}
            fill={!includeButtonNames}
            disabled={true}
          />
        </ButtonGroup>
      </InputWrapper>
      <InputWrapper>
        <SearchWrapper>
          <InputGroup
            className="bp5-monospace-text"
            small={true}
            placeholder="Search..."
          />
        </SearchWrapper>
        <ButtonGroup
          className="bp5-monospace-text"
          style={{ minWidth: '12rem' }}
        >
          <Button
            text={includeButtonNames ? 'Move dog(s)' : null}
            icon="changes"
            small={true}
            outlined={true}
            fill={!includeButtonNames}
          />
          <Button
            text={includeButtonNames ? 'Start walk' : null}
            icon="walk"
            small={true}
            outlined={true}
            fill={!includeButtonNames}
          />
          <Button
            text={includeButtonNames ? 'New Behavior Note' : null}
            icon="git-repo"
            small={true}
            outlined={true}
            fill={!includeButtonNames}
          />
        </ButtonGroup>
      </InputWrapper>
      <StyledTable className="bp5-monospace-text bp5-html-table-striped">
        {includeButtonNames ? (
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Level</th>
              <th>Location</th>
              <th>Last Out</th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {dogs.map((dog, index) => (
            <tr key={index}>
              <td>
                <Checkbox />
              </td>
              <td>
                <Link href={`/dogs/${dog.id}`}>{dog.name}</Link>
              </td>
              <td valign="middle">
                <LevelIndicator
                  color1={dog.level1}
                  color2={dog.level2}
                  small={true}
                />
              </td>
              <td>{dog.location}</td>
              <td>2:15</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Wrapper>
  );
};

export default Dogs;
