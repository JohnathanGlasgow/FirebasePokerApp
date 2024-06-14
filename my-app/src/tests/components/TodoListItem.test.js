import React from 'react';
import { render } from '@testing-library/react';
import TodoListItem from '../../components/TodoListItem';
import * as AuthContext from '../../contexts/AuthContext';

describe('TodoListItem component', () => {
  test('renders the TodoListItem correctly', () => {
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

    const { getByDisplayValue } = render(<TodoListItem todo={mockTodo} />);

    // Check if the input field with the todo title as its value is present in the component
    expect(getByDisplayValue(/Test Todo/i)).toBeInTheDocument();
  });
});