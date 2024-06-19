import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as queries from '../../proxies/queries';
import { GamesCard } from '../../components/GamesCard';
import * as AuthContext from '../../contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../proxies/queries.js');

describe('GamesCard component', () => {
    test('subscribe to the Games collection', async () => {
        const user = { uid: '123' };
        jest.spyOn(AuthContext, 'useAuth').mockReturnValue({
            user,
        });

        // Mock docs data like what we would get from Firestore
        const mockSubscriptionData = [
            {
                id: '1',
                data: () => {
                    return {
                        deckId: '123',
                        id: '111',
                        name: 'Game1',
                        phase: '0',
                    }
                }
            },
            {
                id: '2',
                data: () => {
                    return {
                        deckId: '456',
                        id: '222',
                        name: 'Game2',
                        phase: '0',
                    }
                }
            }
        ];

        // Mock the subscribeToCollection function
        queries.subscribeToCollection = jest.fn((_, handleSnapshot) => {
            handleSnapshot({ docs: mockSubscriptionData });
        });

        // Render the GamesCard component
        const { getByText} = render(<MemoryRouter><GamesCard /></MemoryRouter>);

        // Wait for the component to render
        await waitFor(() => {
            // Check if the mock games are displayed in the GameListItems
            expect(getByText('Game1')).toBeInTheDocument();
            expect(getByText('Game2')).toBeInTheDocument();
        });
    });
});