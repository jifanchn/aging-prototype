"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user roles
type UserRole = 'admin' | 'viewer' | 'maintainer' | 'operator';

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid users with username = password
const VALID_USERS: Record<string, UserRole> = {
  admin: 'admin',
  viewer: 'viewer',
  maintainer: 'maintainer',
  operator: 'operator'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (VALID_USERS[parsedUser.username] === parsedUser.role) {
          setUser(parsedUser);
        }
      } catch (e) {
        // Invalid user data, clear it
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check if username exists and password matches (username = password)
    if (VALID_USERS[username] && password === username) {
      const userObj: User = {
        username,
        role: VALID_USERS[username]
      };
      setUser(userObj);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // Navigation will be handled by the component that calls logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};