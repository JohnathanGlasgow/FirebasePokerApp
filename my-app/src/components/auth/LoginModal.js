/**
 * @file        LoginModal.js
 * @description This file exports a LoginModal component that renders a modal for logging in.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import LoginProvidersCard from './LoginProvidersCard';
import LoadingSpinner from '../LoadingSpinner';

/**
 * LoginModal component for the application.
 * 
 * @returns {React.JSX.Element} The LoginModal component.
 */
function LoginModal() {
  const { loginMethods, authLoading } = useAuth();

  return (
    <Modal show={true} >
      <LoadingSpinner show={authLoading} />
      <Modal.Body>
        <Modal.Header style={{ border: 'none', fontWeight: 'bold' }}>Welcome to Very Fun Poker Game</Modal.Header>
        <Modal.Body >Login with Google:</Modal.Body>
        <LoginProvidersCard />
        <Button variant="link" onClick={loginMethods.anon} style={{ fontStyle: 'italic', textDecoration: 'none' }}>...or login anonymously</Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;