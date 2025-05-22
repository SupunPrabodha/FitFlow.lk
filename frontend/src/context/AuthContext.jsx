import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for token and user data on mount
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('userData');
        
        if (token && userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser(userData);
          // Set default axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Clear any partial auth state
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          localStorage.removeItem('userEmail');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear auth state on error
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userEmail');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token, userData) => {
    try {
      if (!token || !userData) {
        throw new Error('Invalid login data');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userEmail', userData.email);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 