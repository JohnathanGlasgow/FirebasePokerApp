import React from 'react';
import { render } from '@testing-library/react';
import TodoListCard from '../../components/TodoListCard.js';
import * as AuthContext from '../../contexts/AuthContext.js';

jest.mock('../../queries.js');

describe('TodoListCard component', () => {
  test('renders the TodoListCard component and its children correctly', () => {
    // Mock the useAuth hook to return a user id
    const uid = '1234567890asdfghjkl'
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      uid,
    });

    // Render the TodoListCard component
    const { getByText, getByPlaceholderText, container } = render(<TodoListCard />);

    // Get the TodoListCard component by its text
    const todoListCard = getByText(/todo list/i);
    // Check if the TodoListCard component is rendered
    expect(todoListCard).toBeInTheDocument();

    // Check if the todo list is rendered
    const todoList = container.querySelector('.todo-list');
    expect(todoList).toBeInTheDocument();

    // Check if the todo item is rendered
    const todoItem = container.querySelector('.todo-item');
    expect(todoItem).toBeInTheDocument();

    // Check if the input field is rendered
    const inputField = getByPlaceholderText('New Todo...');
    expect(inputField).toBeInTheDocument();
  });
});



