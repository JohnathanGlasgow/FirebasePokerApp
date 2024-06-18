/**
 * @file        LogoutButton.js
 * @description This file exports a LogoutButton component that renders a button.
 *              When clicked, it logs the user out.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

/**
 * LogoutButton component for the application.
 * 
 * @returns {React.JSX.Element} The LogoutButton component.
 */
function LogoutButton() {
  const { logout, loggingOut, authLoading } = useAuth();

  return (
    <>
      {!authLoading && <Button onClick={logout} disabled={loggingOut}>{loggingOut ? "Logging Out..." : "Logout"}</Button>}
    </>
  );
}

export default LogoutButton;