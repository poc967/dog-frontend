'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAllUsers } from '../api/user-actions';

const UsersContext = createContext({ users: [], loading: true, refreshUsers: () => {} });

export function UsersProvider({ children }) {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getAllUsers(token);
      setUsers(data.data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return (
    <UsersContext.Provider value={{ users, loading, refreshUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
