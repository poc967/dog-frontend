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
  Tooltip,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

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

const Username = styled.span`
  display: inline-block;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

  const truncateUsername = (username, maxLength = 15) => {
    if (!username || username.length <= maxLength) {
      return username;
    }
    return username.substring(0, maxLength) + '...';
  };

  const isUsernameTruncated = (username, maxLength = 15) => {
    return username && username.length > maxLength;
  };

  const userMenu = (
    <Menu>
      {user.role === 'admin' ? (
        <MenuItem icon="dashboard" text="Admin Dashboard" href={`/admin`} />
      ) : null}
      <MenuItem icon="person" text="Profile" href={`/user`} />
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
        <Navbar.Heading>
          <Link href="/">Baypath Volunteer Ops</Link>
        </Navbar.Heading>
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>
        <UserInfo>
          <Tag intent={getRoleColor(user?.role)} minimal>
            {user?.role}
          </Tag>
          {isUsernameTruncated(user?.username) ? (
            <Tooltip content={user?.username} position="bottom">
              <Username>{truncateUsername(user?.username)}</Username>
            </Tooltip>
          ) : (
            <Username>{user?.username}</Username>
          )}
          <Popover content={userMenu} position="bottom-right">
            <Button icon="user" minimal style={{ color: 'white' }} />
          </Popover>
        </UserInfo>
      </Navbar.Group>
    </NavBar>
  );
};

export default NavigationBar;
