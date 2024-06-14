import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import LoginProvidersCard from '../../../components/auth/LoginProvidersCard'; 
import * as AuthContext from '../../../contexts/AuthContext';

describe('LoginProvidersCard component', () => {
  test('renders Google login button and handles click correctly', () => {
    // Mock the useAuth hook to return loginMethods
    const loginMethods = { google: jest.fn() };
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
        loginMethods,
    });

    // Render the LoginProvidersCard component
    const { getByAltText } = render(<LoginProvidersCard />);

    // Get the Google login button
    const googleLoginButton = getByAltText('Google logo');

    // Simulate user clicking the Google login button
    fireEvent.click(googleLoginButton);

    // Check if loginMethods.google was called
    expect(loginMethods.google).toHaveBeenCalled();
  });
});