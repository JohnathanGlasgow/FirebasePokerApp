import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import LogoutButton from '../../../components/auth/LogoutButton';
import * as AuthContext from '../../../contexts/AuthContext'; 

describe('LogoutButton component', () => {
    test('renders logout button and handles click correctly', () => {
        // Mock the useAuth hook to return logout
        const logout = jest.fn();
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
            logout,
        });

        // Render the LogoutButton component
        const { getByText } = render(<LogoutButton />);

        // Get the logout button
        const logoutButton = getByText('Logout');

        // Simulate user clicking the logout button
        fireEvent.click(logoutButton);

        // Check if logout was called
        expect(logout).toHaveBeenCalled();
    });
});