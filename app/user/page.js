'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  Tag,
  H3,
  H4,
  H5,
  Spinner,
  Button,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Intent,
  Toaster,
  Position,
} from '@blueprintjs/core';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { devices } from '../constants/constants';
import { createUser } from '../api/user-actions';

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 60vw;
  min-height: 60vh;

  @media ${devices['2xl']} {
    width: 50vw;
  }
  @media ${devices.xl} {
    width: 60vw;
  }
  @media ${devices.lg} {
    width: 70vw;
  }
  @media ${devices.md} {
    width: 80vw;
  }
  @media ${devices.sm} {
    width: 90vw;
  }
  @media ${devices.xs} {
    width: 95vw;
  }
`;

const ProfileCard = styled(Card)`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media ${devices.sm} {
    padding: 1.5rem;
  }
  @media ${devices.xs} {
    padding: 1rem;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  @media ${devices.sm} {
    flex-direction: column;
    text-align: center;
    margin-bottom: 1.5rem;
  }
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 2rem;
  color: white;
  font-weight: 600;

  @media ${devices.sm} {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileTitle = styled(H3)`
  margin: 0 0 0.5rem 0;
  color: #1a202c;
`;

const ProfileSubtitle = styled.p`
  margin: 0;
  color: #718096;
  font-size: 1rem;
`;

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DetailItem = styled.div`
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
  border-left: 4px solid #4299e1;
`;

const DetailLabel = styled(H5)`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.p`
  margin: 0;
  color: #1a202c;
  font-size: 1rem;
  font-weight: 500;
`;

const StatusTag = styled(Tag)`
  margin-top: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  width: 100%;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CreateUserCard = styled(Card)`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media ${devices.sm} {
    padding: 1.5rem;
  }
  @media ${devices.xs} {
    padding: 1rem;
  }
`;

const CreateUserHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;

  @media ${devices.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  @media ${devices.sm} {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;

  @media ${devices.sm} {
    justify-content: stretch;

    button {
      flex: 1;
    }
  }
`;

const UserProfileContent = () => {
  const { user, loading, token } = useAuth();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'volunteer',
  });

  // Create toaster instance inside component to avoid SSR issues
  const AppToaster = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return Toaster.create({
        className: 'recipe-toaster',
        position: Position.TOP,
      });
    }
    return null;
  }, []);

  // Get user initials for avatar
  const getInitials = (username, email) => {
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get role display text
  const getRoleDisplay = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'staff':
        return 'Staff Member';
      case 'volunteer':
        return 'Volunteer';
      default:
        return role || 'Unknown';
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'staff':
        return 'warning';
      case 'volunteer':
        return 'success';
      default:
        return 'minimal';
    }
  };

  // Get status color
  const getStatusColor = (active) => {
    return active ? 'success' : 'minimal';
  };

  // Check if user can create other users
  const canCreateUsers = () => {
    return user?.role === 'admin' || user?.role === 'staff';
  };

  // Get available roles for creation based on current user's role
  const getAvailableRoles = () => {
    if (user?.role === 'admin') {
      return [
        { value: 'volunteer', label: 'Volunteer' },
        { value: 'staff', label: 'Staff' },
      ];
    } else if (user?.role === 'staff') {
      return [{ value: 'volunteer', label: 'Volunteer' }];
    }
    return [];
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate form
  const isFormValid = () => {
    return (
      newUser.username.trim() &&
      newUser.email.trim() &&
      newUser.password.length >= 6 &&
      newUser.role
    );
  };

  // Handle user creation
  const handleCreateUser = async () => {
    if (!isFormValid()) {
      AppToaster?.show({
        message:
          'Please fill in all fields. Password must be at least 6 characters.',
        intent: Intent.WARNING,
      });
      return;
    }

    setCreating(true);
    try {
      const response = await createUser(newUser, token);

      AppToaster?.show({
        message: `User ${newUser.username} created successfully!`,
        intent: Intent.SUCCESS,
      });

      // Reset form
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: 'volunteer',
      });
      setShowCreateUser(false);
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.message || 'Failed to create user';
      AppToaster?.show({
        message: errorMessage,
        intent: Intent.DANGER,
      });
    } finally {
      setCreating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setNewUser({
      username: '',
      email: '',
      password: '',
      role: 'volunteer',
    });
    setShowCreateUser(false);
  };

  if (loading) {
    return (
      <ProfileWrapper>
        <LoadingContainer>
          <Spinner size={40} />
        </LoadingContainer>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <CardsContainer>
        {/* Existing Profile Card */}
        <ProfileCard>
          <ProfileHeader>
            <ProfileAvatar>
              {getInitials(user.username, user.email)}
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileTitle>{user.username || 'Unknown User'}</ProfileTitle>
              <ProfileSubtitle>{user.email}</ProfileSubtitle>
            </ProfileInfo>
          </ProfileHeader>

          <ProfileDetails>
            <DetailItem>
              <DetailLabel>Username</DetailLabel>
              <DetailValue>{user.username || 'Not provided'}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Email Address</DetailLabel>
              <DetailValue>{user.email || 'Not provided'}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Role</DetailLabel>
              <DetailValue>{getRoleDisplay(user.role)}</DetailValue>
              <StatusTag intent={getRoleColor(user.role)} minimal={false}>
                {user.role?.toUpperCase() || 'UNKNOWN'}
              </StatusTag>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Account Status</DetailLabel>
              <DetailValue>
                {user.isActive !== undefined
                  ? user.isActive
                    ? 'Active'
                    : 'Inactive'
                  : 'Unknown'}
              </DetailValue>
              <StatusTag intent={getStatusColor(user.isActive)} minimal={false}>
                {user.isActive !== undefined
                  ? user.isActive
                    ? 'ACTIVE'
                    : 'INACTIVE'
                  : 'UNKNOWN'}
              </StatusTag>
            </DetailItem>
          </ProfileDetails>
        </ProfileCard>

        {/* Create User Card - Only show for staff/admin */}
        {canCreateUsers() && (
          <CreateUserCard>
            <CreateUserHeader>
              <div>
                <H4 style={{ margin: 0 }}>User Management</H4>
                <p style={{ margin: '0.5rem 0 0 0', color: '#718096' }}>
                  Create new{' '}
                  {user.role === 'admin' ? 'staff and volunteer' : 'volunteer'}{' '}
                  accounts
                </p>
              </div>
              {!showCreateUser && (
                <Button
                  intent={Intent.PRIMARY}
                  icon="plus"
                  onClick={() => setShowCreateUser(true)}
                >
                  Create User
                </Button>
              )}
            </CreateUserHeader>

            {showCreateUser && (
              <div>
                <FormRow>
                  <FormGroup
                    label="Username"
                    labelFor="username-input"
                    labelInfo="(required)"
                  >
                    <InputGroup
                      id="username-input"
                      placeholder="Enter username"
                      value={newUser.username}
                      onChange={(e) =>
                        handleInputChange('username', e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup
                    label="Email"
                    labelFor="email-input"
                    labelInfo="(required)"
                  >
                    <InputGroup
                      id="email-input"
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup
                    label="Password"
                    labelFor="password-input"
                    labelInfo="(min 6 characters)"
                  >
                    <InputGroup
                      id="password-input"
                      type="password"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                    />
                  </FormGroup>

                  <FormGroup
                    label="Role"
                    labelFor="role-select"
                    labelInfo="(required)"
                  >
                    <HTMLSelect
                      id="role-select"
                      value={newUser.role}
                      onChange={(e) =>
                        handleInputChange('role', e.target.value)
                      }
                      fill
                    >
                      {getAvailableRoles().map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </HTMLSelect>
                  </FormGroup>
                </FormRow>

                <ButtonContainer>
                  <Button onClick={handleCancel} disabled={creating}>
                    Cancel
                  </Button>
                  <Button
                    intent={Intent.SUCCESS}
                    onClick={handleCreateUser}
                    loading={creating}
                    disabled={!isFormValid() || creating}
                  >
                    Create User
                  </Button>
                </ButtonContainer>
              </div>
            )}
          </CreateUserCard>
        )}
      </CardsContainer>
    </ProfileWrapper>
  );
};

const UserProfile = () => {
  return (
    <ProtectedRoute requiredRole="volunteer">
      <UserProfileContent />
    </ProtectedRoute>
  );
};

export default UserProfile;
