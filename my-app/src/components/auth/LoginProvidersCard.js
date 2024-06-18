/**
 * @file        LoginProvidersCard.js
 * @description This file exports a LoginProvidersCard component that renders a card with login providers.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import { Card, Button } from 'react-bootstrap';
import React from 'react';
import googleLogo from '../../assets/google.png';
import { useAuth } from '../../contexts/AuthContext';

/**
 * LoginProvidersCard component for the application.
 * Contains the various external login providers.
 * 
 * @component
 * @returns {React.JSX.Element} The LoginProvidersCard component.
 */
const LoginProvidersCard = () => {
    const { loginMethods } = useAuth();

    return (
        <Card style={{ width: 'fit-content' }}>
            <Card.Body className="login-providers-card-body">
                <Button variant="light" onClick={loginMethods.google}>
                    <img
                        src={googleLogo}
                        alt="Google logo"
                        style={{ width: '30px', height: '30px' }}
                    />
                </Button>
            </Card.Body>
        </Card>
    );
}

export default LoginProvidersCard;