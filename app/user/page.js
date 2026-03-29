'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
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

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid hsl(var(--border));

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

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media ${devices.sm} {
    grid-template-columns: 1fr;
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

  // // Create toaster instance inside component to avoid SSR issues
  // const AppToaster = React.useMemo(() => {
  //   if (typeof window !== 'undefined') {
  //     return Toaster.create({
  //       className: 'recipe-toaster',
  //       position: Position.TOP,
  //     });
  //   }
  //   return null;
  // }, []);

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
    // if (!isFormValid()) {
    //   AppToaster?.show({
    //     message:
    //       'Please fill in all fields. Password must be at least 6 characters.',
    //     intent: Intent.WARNING,
    //   });
    //   return;
    // }

    setCreating(true);
    try {
      const response = await createUser(newUser, token);

      // AppToaster?.show({
      //   message: `User ${newUser.username} created successfully!`,
      //   intent: Intent.SUCCESS,
      // });

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
      // AppToaster?.show({
      //   message: errorMessage,
      //   intent: Intent.DANGER,
      // });
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
        <div className="flex justify-center items-center p-16 w-full">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper>
      <div className="flex flex-col gap-8">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-8 max-sm:p-4">
            <ProfileHeader>
              <ProfileAvatar>
                {getInitials(user.username, user.email)}
              </ProfileAvatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{user.username || 'Unknown User'}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </ProfileHeader>

            <ProfileDetails>
              <div className="p-4 bg-muted/50 rounded-md border-l-4 border-primary">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Username</h5>
                <p className="font-medium">{user.username || 'Not provided'}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-md border-l-4 border-primary">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Email Address</h5>
                <p className="font-medium">{user.email || 'Not provided'}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-md border-l-4 border-primary">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Role</h5>
                <p className="font-medium">{getRoleDisplay(user.role)}</p>
                <Badge variant={getRoleColor(user.role)} className="mt-2">
                  {user.role?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>

              <div className="p-4 bg-muted/50 rounded-md border-l-4 border-primary">
                <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Account Status</h5>
                <p className="font-medium">
                  {user.isActive !== undefined
                    ? user.isActive
                      ? 'Active'
                      : 'Inactive'
                    : 'Unknown'}
                </p>
                <Badge variant={getStatusColor(user.isActive)} className="mt-2">
                  {user.isActive !== undefined
                    ? user.isActive
                      ? 'ACTIVE'
                      : 'INACTIVE'
                    : 'UNKNOWN'}
                </Badge>
              </div>
            </ProfileDetails>
          </CardContent>
        </Card>

        {/* Create User Card - Only show for staff/admin */}
        {canCreateUsers() && (
          <Card>
            <CardContent className="p-8 max-sm:p-4">
              <div className="flex items-center justify-between mb-6 pb-4 border-b max-sm:flex-col max-sm:items-start max-sm:gap-4">
                <div>
                  <h4 className="text-lg font-semibold">User Management</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Create new{' '}
                    {user.role === 'admin' ? 'staff and volunteer' : 'volunteer'}{' '}
                    accounts
                  </p>
                </div>
                {!showCreateUser && (
                  <Button onClick={() => setShowCreateUser(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create User
                  </Button>
                )}
              </div>

              {showCreateUser && (
                <div>
                  <FormRow>
                    <div className="space-y-2">
                      <Label htmlFor="username-input">Username <span className="text-muted-foreground text-xs">(required)</span></Label>
                      <Input
                        id="username-input"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) =>
                          handleInputChange('username', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email-input">Email <span className="text-muted-foreground text-xs">(required)</span></Label>
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="Enter email address"
                        value={newUser.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                      />
                    </div>
                  </FormRow>

                  <FormRow>
                    <div className="space-y-2">
                      <Label htmlFor="password-input">Password <span className="text-muted-foreground text-xs">(min 6 characters)</span></Label>
                      <Input
                        id="password-input"
                        type="password"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role-select">Role <span className="text-muted-foreground text-xs">(required)</span></Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(val) =>
                          handleInputChange('role', val)
                        }
                      >
                        <SelectTrigger id="role-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableRoles().map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormRow>

                  <ButtonContainer>
                    <Button variant="outline" onClick={handleCancel} disabled={creating}>
                      Cancel
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleCreateUser}
                      disabled={!isFormValid() || creating}
                    >
                      {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Create User
                    </Button>
                  </ButtonContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
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
