'use client';

import { Navbar, Alignment } from '@blueprintjs/core';
import styled from 'styled-components';

const NavBar = styled(Navbar)`
  background-color: #3a193b;
  color: white;
`;

const NavigationBar = (props) => {
  return (
    <NavBar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Baypath Volunteer Ops</Navbar.Heading>
      </Navbar.Group>
    </NavBar>
  );
};

export default NavigationBar;
