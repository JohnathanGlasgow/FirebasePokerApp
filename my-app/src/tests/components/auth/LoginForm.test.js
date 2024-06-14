import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import LoginForm from '../../../components/auth/LoginForm';
import * as AuthContext from '../../../contexts/AuthContext'; 

describe('LoginForm component', () => {
    test('handles form submission correctly', () => {
        // Mock the useAuth hook to return loginMethods
        const loginMethods = { email: jest.fn() };
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
            loginMethods,
        });

        // Render the LoginForm component
        const { getByPlaceholderText, getByTestId } = render(<LoginForm />);

        // Get the email and password input elements
        const emailInput = getByPlaceholderText('Enter email');
        const passwordInput = getByPlaceholderText('Password');

        // Simulate user typing into the input fields
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });


        // Check if the input fields have the correct value
        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password');
        // Simulate form submission
        fireEvent.submit(getByTestId('login-form'));

        // Check if loginMethods was called
        expect(loginMethods.email).toHaveBeenCalled();
    });
});