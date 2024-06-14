/**
 * AuthContext.js
 * 
 * Context provider for Firebase authentication.
 */

import { createContext, useState, useEffect, useContext } from 'react';
import { signInAnon, signOutUser, subscribeToAuth, signInWithEmail, signInWithGoogle } from '../firebaseAuth'; // import Firebase methods
import { setDocument, deleteDocument } from '../queries';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

/**
 * AuthProvider component for the application.
 * 
 * @param {Object} props - The properties of the Provider component.
 * @param {any} props.value - The value to be provided to the context.
 * @param {React.ReactNode} props.children - The child components.
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authLoading, setIsLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userName, setUserName] = useState({});

  /**
   * State hook for user.
   * @type {Object} user - The current user.
   * @type {function} setUser - The setter function for user.
   * @default null
   */
  const [user, setUser] = useState(null);

  /**
   * State hook for error.
   * @type {string} error - The current error message.
   * @type {function} setError - The setter function for error.
   * @default ''
   */
  const [error, setError] = useState('');

  /**
   * Effect hook for subscribing to Firebase authentication.
   * Unsubscribes when the component unmounts.
   */
  useEffect(() => {
    try {
    setIsLoading(true);
    return subscribeToAuth(handleUser);
    }
    catch (error) {
      console.error("Error subscribing to auth: ", error);
      setError("An error occurred. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Handles a user object from Firebase authentication.
   * @param {Object} user - The user object from Firebase authentication.
   * @returns {void}
   */
  const handleUser = async (user) => {
    if (user) {
      // There is some error handling here to prevent the user from being logged in if the user document can't be set
      try {
        await setDocument(["users", user.uid], {
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
        });
        setUser(user);
        setUserName(user.displayName ?? user.email ? user.email.match(/[^@]*/)[0] : 'Anon');
        navigate(`/user/${user.uid}`);
        setError('');
      } catch (error) {
        console.error('Error in handleUser:', error);
        setError('There\'s been an error logging in, please try again.');
      } finally {
        setIsLoading(false);
      }

    } else {
      setUser(null);
      setIsLoading(false);
      navigate('/login', { replace: true });
    }
  };

  /**
   * Object containing login methods.
   * @type {Object}
   * @property {function} anon - The anonymous login method.
   * @property {function} email - The email login method.
   */
  const loginMethods = {
    anon: async () => {
      setIsLoading(true);
      try {
        await signInAnon();
      } catch (error) {
        setError('Anonymous login failed.');
        setIsLoading(false);
      }
    },
    email: async (email, password) => {
      setIsLoading(true);
      try {
        await signInWithEmail(email, password);
      } catch (error) {
        // ...
        setError('Email login failed.');
        setIsLoading(false);
      }
    },
    google: async () => {
      setIsLoading(true);
      try {
        await signInWithGoogle();
      } catch (error) {
        setError('Google login failed.');
        setIsLoading(false);
      }
    }
  }

  /**
   * Logs out the current user.
   * @returns {void}
   */
  const logout = async () => {
    if (!user) return;
    setLoggingOut(true);
    try {
      await signOutUser();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider value={{ uid: user?.uid, user, loginMethods, logout, loggingOut, error, authLoading, userName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}