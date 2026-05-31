'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Card, CardContent } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/app/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
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

const UserForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;

  @media ${devices.lg} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;

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

const InviteForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 1rem;
  align-items: end;

  @media ${devices.lg} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;

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

const AdminContent = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'volunteer',
  });
  const [inviteUserData, setInviteUserData] = useState({
    username: '',
    email: '',
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

  const handleInviteInputChange = (field) => (e) => {
    setInviteUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const sendInvite = async () => {
    if (!inviteUserData.username || !inviteUserData.email) {
      setError('Invite requires username and email');
      return;
    }

    setInviting(true);
    try {
      await axios.post(API_ENDPOINTS.AUTH.INVITE, inviteUserData);
      setSuccess('Invitation sent successfully');
      setInviteUserData({ username: '', email: '', role: 'volunteer' });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviting(false);
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
        return 'success';
      case 'staff':
        return 'default';
      case 'volunteer':
        return 'warning';
      default:
        return 'secondary';
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
      if (error.status === 409) {
        setError(
          error.message ||
            'Location already exists. The location list has been refreshed.',
        );
        fetchLocations();
      } else {
        setError(error.message || 'Failed to create location');
      }
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
      if (error.status === 409) {
        setError(
          error.message ||
            'Location changed by another user. The location list has been refreshed.',
        );
        fetchLocations();
      } else {
        setError(error.message || 'Failed to update location');
      }
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
      if (error.status === 409) {
        setError(
          error.message ||
            'Location update conflict detected. The location list has been refreshed.',
        );
        fetchLocations();
      } else {
        setError(error.message || 'Failed to delete location');
      }
    }
  };

  // Fetch both users and locations on component mount
  useEffect(() => {
    fetchUsers();
    fetchLocations();
  }, [fetchUsers, fetchLocations]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminWrapper>
      <h1 className="text-2xl font-bold mb-8 max-sm:text-xl max-sm:mb-6">
        User Management
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Section>
        <Card className="mb-8">
          <CardContent className="p-6 max-sm:p-4">
            <h3 className="text-lg font-semibold mb-4 max-sm:text-base max-sm:mb-3">
              Create New User
            </h3>
            <UserForm>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={handleInputChange('username')}
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={newUser.email}
                  onChange={handleInputChange('email')}
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={handleInputChange('password')}
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(val) =>
                    handleInputChange('role')({ target: { value: val } })
                  }
                  disabled={creating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={createUser} disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create User
              </Button>
            </UserForm>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6 max-sm:p-4">
            <h3 className="text-lg font-semibold mb-4 max-sm:text-base max-sm:mb-3">
              Invite User (Set Password On First Use)
            </h3>
            <InviteForm>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  placeholder="Enter username"
                  value={inviteUserData.username}
                  onChange={handleInviteInputChange('username')}
                  disabled={inviting}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={inviteUserData.email}
                  onChange={handleInviteInputChange('email')}
                  disabled={inviting}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={inviteUserData.role}
                  onValueChange={(val) =>
                    handleInviteInputChange('role')({ target: { value: val } })
                  }
                  disabled={inviting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={sendInvite} disabled={inviting}>
                {inviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Invite
              </Button>
            </InviteForm>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <h3 className="text-lg font-semibold mb-4 max-sm:text-base max-sm:mb-3">
          All Users
        </h3>
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(val) => updateUserRole(user._id, val)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      {/* Location Management Section */}
      <Section>
        <Card className="mb-8">
          <CardContent className="p-6 max-sm:p-4">
            <h3 className="text-lg font-semibold mb-4 max-sm:text-base max-sm:mb-3">
              Create New Location
            </h3>
            <LocationForm>
              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input
                  placeholder="Enter location name"
                  value={newLocation.name}
                  onChange={(e) =>
                    handleLocationInputChange('name', e.target.value)
                  }
                  disabled={creatingLocation}
                />
              </div>

              <div className="space-y-2">
                <Label>Walking Loop</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newLocation.walkable}
                    onCheckedChange={(checked) =>
                      handleLocationInputChange('walkable', checked)
                    }
                    disabled={creatingLocation}
                  />
                  <span className="text-sm">
                    {newLocation.walkable ? 'Walking Loop' : 'Pen/Yard'}
                  </span>
                </div>
              </div>

              <Button onClick={createNewLocation} disabled={creatingLocation}>
                {creatingLocation && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create Location
              </Button>
            </LocationForm>
          </CardContent>
        </Card>
      </Section>

      <Section>
        <h3 className="text-lg font-semibold mb-4 max-sm:text-base max-sm:mb-3">
          All Locations
        </h3>
        {locationsLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location._id || location.id}>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={location.walkable ? 'default' : 'success'}
                      >
                        {location.walkable ? 'Walking Loop' : 'Pen/Yard'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={location.walkable}
                          onCheckedChange={() =>
                            updateLocationToggle(
                              location._id || location.id,
                              location.walkable,
                            )
                          }
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteLocationById(location._id || location.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
