/**
 * LoginModal.js
 * 
 * This file exports a LoginModal component that renders a modal for logging in.
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
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
        <Modal.Header style={{ border: 'none', fontWeight: 'bold' }}>Login in with... </Modal.Header>
        <LoginProvidersCard />
        <Modal.Header style={{ border: 'none', fontWeight: 'bold' }}>Or login with email... </Modal.Header>
        <LoginForm />
        <Button variant="link" onClick={loginMethods.anon} style={{ fontStyle: 'italic', textDecoration: 'none' }}>...or login anonymously</Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;