import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import TodoTitle from '../../components/TodoTitle';
import { setDocument } from '../../queries';
import * as AuthContext from '../../contexts/AuthContext';

jest.mock('../../queries.js');

describe('TodoTitle component', () => {
    test('handles todo title editing correctly', async () => {
        // Mock the useAuth hook to return a user id
        const uid = '1234567890asdfghjkl'
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
            uid,
        });

        // Mock todo data
        const mockTodo = {
            completed: false,
            id: '123',
            title: 'Test Todo',
            dateCreated: '2024-03-18T21:56:29.024Z',
        };

        // Mock the implementation of setDocument
        setDocument.mockResolvedValueOnce(mockTodo);

        // Render the TodoTitle component
        const { getByDisplayValue } = render(<TodoTitle todo={mockTodo} />);

        // Get the input element
        const input = getByDisplayValue(mockTodo.title);

        // Simulate a click event to trigger editing mode
        fireEvent.click(input);

        // Change the title value
        fireEvent.change(input, { target: { value: 'New Todo Title' } });

        // Simulate an Enter key down event to save the changes
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        // Wait for setDocument to resolve
        await waitFor(() => {
            // Check if setDocument is called with the correct parameters
            expect(setDocument).toHaveBeenCalledWith(["users", uid, "todos", mockTodo.id], { title: 'New Todo Title' });
        });
    });
});