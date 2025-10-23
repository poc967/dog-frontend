'use client';

import { useState, useEffect } from 'react';
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
} from '@blueprintjs/core';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const CreateUserCard = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const UserForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
`;

const StyledTable = styled(HTMLTable)`
  width: 100%;
  margin-top: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const AdminContent = () => {
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.AUTH.USERS);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner size={50} />
      </LoadingContainer>
    );
  }

  return (
    <AdminWrapper>
      <h1>User Management</h1>

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
          <h3>Create New User</h3>
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
        <h3>All Users</h3>
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
