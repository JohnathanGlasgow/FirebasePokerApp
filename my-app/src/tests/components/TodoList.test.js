import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as queries from '../../queries';
import TodoList from '../../components/TodoList';
import * as AuthContext from '../../contexts/AuthContext';

jest.mock('../../queries.js');

describe('TodoList component', () => {
  test('renders the TodoList component', async () => {
    // Mock the useAuth hook to return a user id
    const uid = '1234567890asdfghjkl'
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
      uid,
    });

    // Mock docs data like what we would get from Firestore
    const mockSubscriptionData = [
      {
        id: '1',
        data: () => {
          return {
            completed: true,
            id: '1',
            title: 'Todo1',
            dateCreated: '2024-03-18T21:56:29.024Z',
          }
        }
      },
      {
        id: '2',
        data: () => {
          return {
            completed: false,
            id: '2',
            title: 'Todo2',
            dateCreated: '2024-03-18T21:49:23.125Z',
          }
        }
      }
    ];

    // Mock the subscribeToCollection function
    queries.subscribeToCollection = jest.fn((_, handleSnapshot) => {
      handleSnapshot({ docs: mockSubscriptionData });
    });

    // Render the TodoList component
    const { getByDisplayValue } = render(<TodoList />);

    // Wait for the component to render
    await waitFor(() => {
      // Check if input elements have the correct value
      expect(getByDisplayValue('Todo1')).toBeInTheDocument();
      expect(getByDisplayValue('Todo2')).toBeInTheDocument();
    });
  });
});