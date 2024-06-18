/**
 * @file        LoginForm.js 
 * @description The login form component for the application.
 *              Used in the LoginModal component for logging in with email and password.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */
    
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * LoginForm component for the application.
 * 
 * @returns {React.JSX.Element} The LoginForm component.
 */
function LoginForm() {
    const { loginMethods, error } = useAuth();

    /**
     * State hook for email.
     * @type {string} email - The email state.
     * @type {function} setEmail - The setter function for email.
     * @default ''
     */
    const [email, setEmail] = useState('');

    /**
     * State hook for password.
     * @type {string} password - The password state.
     * @type {function} setPassword - The setter function for password.
     * @default ''
     */
    const [password, setPassword] = useState('');
  
    /**
     * Handles the form submission.
     * 
     * @param {Object} event - The form submission event.
     * @returns {void}
     */
    const handleSubmit = (event) => {
      event.preventDefault();
      loginMethods.email(email, password);
    };

    return (
        <Form onSubmit={handleSubmit} data-testid='login-form'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default LoginForm;