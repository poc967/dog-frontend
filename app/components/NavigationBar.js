'use client';

import {
  Navbar,
  Alignment,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Tag,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const NavBar = styled(Navbar)`
  background-color: #3a193b;
  color: white;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
`;

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Don't show navbar on login page
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'success';
      case 'staff':
        return 'primary';
      case 'volunteer':
        return 'warning';
      default:
        return 'minimal';
    }
  };

  const userMenu = (
    <Menu>
      <MenuItem icon="person" text="Profile" />
      <MenuItem icon="key" text="Change Password" />
      <MenuDivider />
      <MenuItem
        icon="log-out"
        text="Sign Out"
        intent="danger"
        onClick={logout}
      />
    </Menu>
  );

  return (
    <NavBar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Baypath Volunteer Ops</Navbar.Heading>
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>
        <UserInfo>
          <Tag intent={getRoleColor(user?.role)} minimal>
            {user?.role}
          </Tag>
          <span>{user?.username}</span>
          <Popover content={userMenu} position="bottom-right">
            <Button icon="user" minimal style={{ color: 'white' }} />
          </Popover>
        </UserInfo>
      </Navbar.Group>
    </NavBar>
  );
};

export default NavigationBar;
