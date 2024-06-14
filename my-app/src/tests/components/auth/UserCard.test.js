import { render } from '@testing-library/react';
import React from 'react';
import UserCard from '../../../components/auth/UserCard';
import * as AuthContext from '../../../contexts/AuthContext'; 

describe('UserCard component', () => {
    test('renders user information correctly', () => {
        // Mock the useAuth hook to return user information
        const user = {
            email: 'test@example.com',
            isAnonymous: false,
        };
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
            user,
        });

        // Render the UserCard component
        const { getByText } = render(<UserCard />);

        // Check if the correct user information is displayed
        expect(getByText('Logged in as: test@example.com')).toBeInTheDocument();
    });
});