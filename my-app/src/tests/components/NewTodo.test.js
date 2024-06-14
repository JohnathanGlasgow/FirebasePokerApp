import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import NewTodo from '../../components/NewTodo.js';
import { addDocument } from '../../queries.js';
import * as AuthContext from '../../contexts/AuthContext.js';

jest.mock('../../queries.js');

describe('NewTodo component', () => {
  test('new todo added correctly', async () => {
    // Mock the useAuth hook to return the user's uid
    const uid = '1234567890asdfghjkl'
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      uid,
    });

    const mockTitle = 'Test Todo';

    // Mock the implementation of addDocument
    addDocument.mockResolvedValue();

    // Render the NewTodo component
    const { getByPlaceholderText } = render(<NewTodo />);

    // Get the input element
    const input = getByPlaceholderText('New Todo...');

    // Set the value of the input field
    fireEvent.change(input, { target: { value: mockTitle } });

    // Fire a key press event
    act(() => {
      fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });
    });

    // Wait for addDocument to resolve
    await waitFor(() => {
      // Check if the addDocument function was called with correct arguments
      expect(addDocument).toHaveBeenCalledWith(
        ['users', uid, 'todos'],
        expect.objectContaining({ title: mockTitle })
      );
      // checking if the input field is cleared after adding a todo
      expect(input.value).toBe('');
    });
  });
});