import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import LoginModal from '../../../components/auth/LoginModal';
import * as AuthContext from '../../../contexts/AuthContext'; 

describe('LoginModal component', () => {
    test('handles anonymous login click correctly', () => {
        // Mock the useAuth hook to return loginMethods
        const loginMethods = { anon: jest.fn() };
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
            loginMethods,
        });

        // Render the LoginModal component
        const { getByText } = render(<LoginModal />);

        // Get the anonymous login button
        const anonLoginButton = getByText('...or login anonymously');

        // Simulate user clicking the anonymous login button
        fireEvent.click(anonLoginButton);

        // Check if loginMethods.anon was called
        expect(loginMethods.anon).toHaveBeenCalled();
    });
});