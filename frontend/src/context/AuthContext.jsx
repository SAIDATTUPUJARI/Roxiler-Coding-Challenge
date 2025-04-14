import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setToken(token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  // Load user
  const loadUser = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/auth/user');
        setUser(res.data);
        setIsAuthenticated(true);
    } catch (err) {
        console.error('Error loading user:', err.response?.data?.message || err.message);
        // Clear invalid token if 401
        if (err.response?.status === 401) {
            setAuthToken(null);
        }
        setUser(null);
        setIsAuthenticated(false);
    }
};

  // Login
  const login = async (username, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    setAuthToken(res.data.token);
    await loadUser();
  };

  // Signup
  const signup = async (username, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/signup', {
      username,
      email,
      password
    });
        setAuthToken(res.data.token);
    await loadUser();
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update password
  const updatePassword = async (username, currentPassword, newPassword) => {
    await axios.put('http://localhost:5000/api/auth/update-password', { username, currentPassword, newPassword });
  };

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updatePassword,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider };