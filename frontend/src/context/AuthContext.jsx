import React, { createContext, useContext, useState, useEffect } from 'react';
import * as storage from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial DB Setup & session restore
    storage.initDb();
    const storedUser = storage.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = storage.loginUser(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const registeredUser = storage.registerUser(userData);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    storage.logoutUser();
    setUser(null);
  };

  const updateUserProfile = (profileData) => {
    try {
      const updated = storage.updateProfile(profileData);
      setUser(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const refreshUser = () => {
    const updated = storage.getCurrentUser();
    if (updated) setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
