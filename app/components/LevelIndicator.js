import styled from 'styled-components';
import { mapLevelToColor } from '../helpers/helpers';

const Container = styled.div`
  width: ${(props) => (props.small == true ? '1.5rem' : '3rem')};
  height: 1.2rem;
  display: flex;
  margin-bottom: ${(props) => (props.compact == true ? '0px' : '10px')};
`;

const HalfOne = styled.div`
  width: 10px;
  height: 20px;
  background-color: ${(props) => props.color || '#BF4F74'};
  border-radius: 25px 0px 0px 25px;
  transform: rotate(45deg) translate(0px, -5px);
`;

const HalfTwo = styled.div`
  width: 10px;
  height: 20px;
  background-color: ${(props) => props.color || '#BF4F74'};
  border-radius: 0px 25px 25px 0px;
  transform: rotate(45deg) translate(2px, 2px);
`;

const LevelIndicator = (props) => {
  return (
    <Container small={props.small}>
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
