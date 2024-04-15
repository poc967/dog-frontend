import styled from 'styled-components';
import { mapLevelToColor } from '../helpers/helpers';

const Container = styled.div`
  width: 3rem;
  height: 1.2rem;
  display: flex;
  margin-bottom: ${(props) => (props.compact == true ? '0px' : '10px')};
`;

const HalfOne = styled.div`
  width: 50%;
  height: 100%;
  background-color: ${(props) => props.color || '#BF4F74'};
  border-radius: 3px 0px 0px 3px;
`;

const HalfTwo = styled.div`
  width: 50%;
  height: 100%;
  background-color: ${(props) => props.color || '#BF4F74'};
  border-radius: 0px 3px 3px 0px;
`;

const LevelIndicator = (props) => {
  return (
    <Container>
      <HalfOne color={mapLevelToColor(props.color1)}></HalfOne>
      <HalfTwo
        color={
          props.color2
            ? mapLevelToColor(props.color2)
            : mapLevelToColor(props.color1)
        }
      ></HalfTwo>
    </Container>
  );
};

export default LevelIndicator;
