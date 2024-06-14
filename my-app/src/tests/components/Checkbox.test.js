import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Checkbox from '../../components/Checkbox';
import { setDocument } from '../../queries';
import * as AuthContext from '../../contexts/AuthContext';

jest.mock('../../queries');

describe('Checkbox component', () => {
  test('handles checkbox change correctly', async () => {
    // Mock the useAuth hook to return user's uid
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

    // Mock the implementation of updateDocument
    setDocument.mockResolvedValue();

    // Render the Checkbox component
    const { getByRole } = render(<Checkbox todo={mockTodo} />);

    // Get the checkbox element
    const checkbox = getByRole('checkbox');

    // Simulate a checkbox change event
    fireEvent.click(checkbox);

    // Wait for setDocument to resolve
    await waitFor(() => {
      // Check if updateDocument is called with the correct parameters
      expect(setDocument).toHaveBeenCalledWith(['users', uid, 'todos', mockTodo.id], { completed: !mockTodo.completed });
    });
  });
});