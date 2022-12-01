import { createContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

import { useNavigate } from 'react-router-dom';
import { sendData } from '../services/utils/sendRequest';
import { API_URL } from '../config';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null
  );

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    const loginUrl = `${API_URL}/api/auth/token/`;

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    const responseData = await response.json();
    if (response.status === 200) {
      setAuthToken(responseData);
      setUser(jwt_decode(responseData.access));

      localStorage.setItem('authToken', JSON.stringify(responseData));
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const registerUser = async (username, email, password, passwordConfirm) => {
    const registerUrl = `${API_URL}/api/auth/register/`;
    const userCredentials = {
      username,
      email,
      password,
      passwordConfirm
    };
    const response = await sendData(registerUrl, userCredentials);
    if (response.status !== 400) {
      navigate('/login');
    } else {
      alert('bad');
    }
  };

  const updateToken = async () => {
    const loginUrl = `${API_URL}/api/auth/token/refresh/`;

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        refresh: authToken?.refresh
      })
    });

    const responseData = await response.json();

    if (response.status === 200) {
      setAuthToken(responseData);
      setUser(jwt_decode(responseData.access));
      localStorage.setItem('authToken', JSON.stringify(responseData));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken().then();
    }

    const intervalDelay = 1000 * (60 * 5);

    const interval = setInterval(() => {
      if (authToken) {
        updateToken().then();
      }
    }, intervalDelay);

    return () => clearInterval(interval);
  }, [authToken, loading, updateToken]);

  const contextData = {
    user,
    authToken,
    loginUser,
    logoutUser,
    registerUser
  };

  return (
    <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>
  );
};

export { AuthContext };
export { AuthProvider };
