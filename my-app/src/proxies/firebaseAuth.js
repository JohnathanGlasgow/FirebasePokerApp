/**
 * firebaseAuth.js
 * This file proxies out the Firebase authentication methods.
 */

import { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase.js';


/**
 * Subscribes to authentication changes.
 * @param {function} handleUser - The function to call when the user changes.
 * @returns {function} The unsubscribe function for the listener.
 */
export const subscribeToAuth = (handleUser) => {
  return onAuthStateChanged(auth, handleUser);
};

/**
 * Signs in an anonymous user.
 * @returns {Promise<void>} A Promise that resolves when the user has signed in.
 */
export const signInAnon = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log('Signed in user:', userCredential.user);
  } catch (error) {
    console.error('Failed to sign in anonymously:', error);
    throw error;
  }
};

/**
 * Signs in a user with an email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} A Promise that resolves when the user has signed in.
 */
export const signInWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Failed to sign in with email and password:', error);
    throw error;
  }
};

/**
 * Signs in with Google.
 * @returns {Promise<void>} A Promise that resolves when the user has signed in.
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>} A Promise that resolves when the user has signed out.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
};
