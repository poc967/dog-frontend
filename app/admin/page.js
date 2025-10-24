'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  HTMLTable,
  Card,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Callout,
  Intent,
  Tag,
  Spinner,
  Toaster,
  Position,
  Switch,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import { devices } from '../constants/constants';
import {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
} from '../api/location-actions';
import { useAuth } from '../contexts/AuthContext';

const AdminWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media ${devices.md} {
    padding: 1.5rem;
  }

  @media ${devices.sm} {
    padding: 1rem;
  }

  @media ${devices.xs} {
    padding: 0.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const CreateUserCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media ${devices.md} {
    padding: 1.25rem;
  }

  @media ${devices.sm} {
    padding: 1rem;
  }

  @media ${devices.xs} {
    padding: 0.75rem;
  }
`;

const LocationCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media ${devices.md} {
    padding: 1.25rem;
  }

  @media ${devices.sm} {
    padding: 1rem;
  }

  @media ${devices.xs} {
    padding: 0.75rem;
  }
`;

const UserForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;

  @media ${devices.lg} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;

    /* Make button span full width on smaller screens */
    button {
      grid-column: 1 / -1;
      justify-self: center;
      width: 200px;
    }
  }

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: 0.75rem;

    button {
      grid-column: 1;
      width: 100%;
      margin-top: 0.5rem;
    }
  }
`;

const LocationForm = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;

  @media ${devices.md} {
    grid-template-columns: 1fr;
    gap: 0.75rem;

    button {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
`;

const StyledTable = styled(HTMLTable)`
  width: 100%;
  margin-top: 1rem;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media ${devices.md} {
    /* Add some padding to prevent content from touching edges */
    padding: 0 0.5rem;
    margin: 0 -0.5rem;
  }

  /* Hide table headers that are less important on mobile */
  @media ${devices.sm} {
    table th:nth-child(4), /* Created */
    table td:nth-child(4) {
      display: none;
    }
  }

  @media ${devices.xs} {
    table th:nth-child(2), /* Email */
    table td:nth-child(2) {
      display: none;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;

  @media ${devices.sm} {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;

  @media ${devices.sm} {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`;

const AdminContent = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'volunteer',
  });

  // Location management state
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [creatingLocation, setCreatingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    walkable: false,
  });

  // // Create toaster instance inside component to avoid SSR issues
  // const AppToaster = React.useMemo(() => {
  //   if (typeof window !== 'undefined') {
  //     return Toaster.create({
  //       className: 'admin-toaster',
  //       position: Position.TOP,
  //     });
  //   }
  //   return null;
  // }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.USERS);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (field) => (e) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const createUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, newUser);

      // // Show success toast
      // AppToaster?.show({
      //   message: `User ${newUser.username} created successfully!`,
      //   intent: Intent.SUCCESS,
      //   timeout: 3000,
      // });

      setSuccess('User created successfully');
      setNewUser({ username: '', email: '', password: '', role: 'volunteer' });
      fetchUsers(); // Refresh the users list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(API_ENDPOINTS.AUTH.USER_BY_ID(userId), { role: newRole });

      // // Show success toast
      // AppToaster?.show({
      //   message: `User role updated to ${newRole} successfully!`,
      //   intent: Intent.SUCCESS,
      //   timeout: 3000,
      // });

      setSuccess('User role updated successfully');
      fetchUsers(); // Refresh the users list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return Intent.SUCCESS;
      case 'staff':
        return Intent.PRIMARY;
      case 'volunteer':
        return Intent.WARNING;
      default:
        return Intent.NONE;
    }
  };

  // Location management functions
  const fetchLocations = useCallback(async () => {
    try {
      const response = await getAllLocations(token);
      setLocations(response.data || response);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations');
    } finally {
      setLocationsLoading(false);
    }
  }, [token]);

  const handleLocationInputChange = (field, value) => {
    setNewLocation((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const createNewLocation = async () => {
    if (!newLocation.name.trim()) {
      setError('Please enter a location name');
      return;
    }

    setCreatingLocation(true);
    try {
      await createLocation(newLocation, token);
      setSuccess('Location created successfully');
      setNewLocation({ name: '', walkable: false });
      fetchLocations(); // Refresh the locations list
    } catch (error) {
      setError(error.message || 'Failed to create location');
    } finally {
      setCreatingLocation(false);
    }
  };

  const updateLocationToggle = async (locationId, currentValue) => {
    try {
      await updateLocation(locationId, { walkable: !currentValue }, token);
      setSuccess('Location updated successfully');
      fetchLocations(); // Refresh the locations list
    } catch (error) {
      setError(error.message || 'Failed to update location');
    }
  };

  const deleteLocationById = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await deleteLocation(locationId, token);
      setSuccess('Location deleted successfully');
      fetchLocations(); // Refresh the locations list
    } catch (error) {
      setError(error.message || 'Failed to delete location');
    }
  };

  // Fetch both users and locations on component mount
  useEffect(() => {
    fetchUsers();
    fetchLocations();
  }, [fetchUsers, fetchLocations]);

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner size={50} />
      </LoadingContainer>
    );
  }

  return (
    <AdminWrapper>
      <PageTitle>User Management</PageTitle>

      {error && (
        <Callout intent={Intent.DANGER} style={{ marginBottom: '1rem' }}>
          {error}
        </Callout>
      )}

      {success && (
        <Callout intent={Intent.SUCCESS} style={{ marginBottom: '1rem' }}>
          {success}
        </Callout>
      )}

      <Section>
        <CreateUserCard>
          <SectionTitle>Create New User</SectionTitle>
          <UserForm>
            <FormGroup label="Username">
              <InputGroup
                placeholder="Enter username"
                value={newUser.username}
                onChange={handleInputChange('username')}
                disabled={creating}
              />
            </FormGroup>

            <FormGroup label="Email">
              <InputGroup
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={handleInputChange('email')}
                disabled={creating}
              />
            </FormGroup>

            <FormGroup label="Password">
              <InputGroup
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={handleInputChange('password')}
                disabled={creating}
              />
            </FormGroup>

            <FormGroup label="Role">
              <HTMLSelect
                value={newUser.role}
                onChange={handleInputChange('role')}
                disabled={creating}
              >
                <option value="volunteer">Volunteer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </HTMLSelect>
            </FormGroup>

            <Button
              intent={Intent.PRIMARY}
              text="Create User"
              loading={creating}
              onClick={createUser}
            />
          </UserForm>
        </CreateUserCard>
      </Section>

      <Section>
        <SectionTitle>All Users</SectionTitle>
        <TableWrapper>
          <StyledTable striped interactive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Tag intent={getRoleColor(user.role)}>{user.role}</Tag>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <HTMLSelect
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </HTMLSelect>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </Section>

      {/* Location Management Section */}
      <Section>
        <LocationCard>
          <SectionTitle>Create New Location</SectionTitle>
          <LocationForm>
            <FormGroup label="Location Name">
              <InputGroup
                placeholder="Enter location name"
                value={newLocation.name}
                onChange={(e) =>
                  handleLocationInputChange('name', e.target.value)
                }
                disabled={creatingLocation}
              />
            </FormGroup>

            <FormGroup label="Walking Loop">
              <Switch
                checked={newLocation.walkable}
                onChange={(e) =>
                  handleLocationInputChange('walkable', e.target.checked)
                }
                disabled={creatingLocation}
                label={newLocation.walkable ? 'Walking Loop' : 'Pen/Yard'}
              />
            </FormGroup>

            <Button
              intent={Intent.PRIMARY}
              text="Create Location"
              loading={creatingLocation}
              onClick={createNewLocation}
            />
          </LocationForm>
        </LocationCard>
      </Section>

      <Section>
        <SectionTitle>All Locations</SectionTitle>
        {locationsLoading ? (
          <LoadingContainer>
            <Spinner size={30} />
          </LoadingContainer>
        ) : (
          <TableWrapper>
            <StyledTable striped interactive>
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location._id || location.id}>
                    <td>{location.name}</td>
                    <td>
                      <Tag
                        intent={
                          location.walkable ? Intent.PRIMARY : Intent.SUCCESS
                        }
                      >
                        {location.walkable ? 'Walking Loop' : 'Pen/Yard'}
                      </Tag>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                        }}
                      >
                        <Switch
                          checked={location.walkable}
                          onChange={() =>
                            updateLocationToggle(
                              location._id || location.id,
                              location.walkable
                            )
                          }
                          label=""
                          small
                        />
                        <Button
                          intent={Intent.DANGER}
                          text="Delete"
                          small
                          onClick={() =>
                            deleteLocationById(location._id || location.id)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>
        )}
      </Section>
    </AdminWrapper>
  );
};

const AdminPanel = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
};

export default AdminPanel;
