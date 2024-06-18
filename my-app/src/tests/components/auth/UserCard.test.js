import { render, screen } from '@testing-library/react';
import React from 'react';
import UserCard from '../../../components/auth/UserCard';
import { AuthContext } from '../../../contexts/AuthContext'; 

describe('UserCard component', () => {
    test('renders user information correctly', () => {
        // Mock the useAuth hook to return user information
        const userName = 'Dennis';
        // Mock the context to return the mocked user
        const mockAuthContext = {
            userName,
        };

        // Render the UserCard component
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <UserCard />
            </AuthContext.Provider>
        );

        // Check if the correct user information is displayed
        expect(screen.getByText('Dennis')).toBeInTheDocument();
    });
});