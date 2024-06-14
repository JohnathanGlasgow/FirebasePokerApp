import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import DeleteButton from '../../components/DeleteButton';
import { deleteDocument } from '../../queries';
import * as AuthContext from '../../contexts/AuthContext';

jest.mock('../../queries');

describe('DeleteButton component', () => {
    test('handles todo deletion correctly', async () => {
        // Mock the useAuth hook to return the user's uid
        const uid = '1234567890asdfghjkl'
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
          uid,
        });

        // Mock todoId
        const todoId = '123';

        // Mock the implementation of deleteDocument
        deleteDocument.mockResolvedValue();

        // Render the DeleteButton component
        const { getByRole } = render(<DeleteButton todoId={todoId} />);

        // Get the button element
        const button = getByRole('button');

        // Simulate a click event to trigger the deletion of the todo
        fireEvent.click(button);

        // Wait for deleteDocument to resolve
        await waitFor(() => {
            // Check if deleteDocument is called with the correct parameters
            expect(deleteDocument).toHaveBeenCalledWith(["users", uid, "todos", todoId]);
        });
    });
});