import { render, fireEvent, waitFor } from '@testing-library/react';
import { GameListItem } from '../../components/GameListItem';
import { BrowserRouter as Router } from 'react-router-dom';
import * as AuthContext from '../../contexts/AuthContext';
import * as queries from '../../proxies/queries';

jest.mock('../../contexts/AuthContext.js', () => ({
    useAuth: () => ({ uid: '123', userName: 'Test User' }),
}));

jest.mock('../../proxies/queries');

test('clicking Join button calls the joinGame function', async () => {
    const game = { id: '1', name: 'Test Game', gameStarted: false };
    queries.setDocument.mockResolvedValue();

    const { getByText } = render(
        <Router>
            <GameListItem game={game} />
        </Router>
    );

    const joinButton = getByText('Join');

    fireEvent.click(joinButton);
    expect(queries.setDocument).toHaveBeenCalled();
});


test('subscribe to the players collection and display correct player count', async () => {
    const game = { id: '1', name: 'Test Game', gameStarted: false };

    // Mock docs data like what we would get from Firestore
    const mockSubscriptionData = [
        {
            id: '1',
            data: () => ({ })
        },
        {
            id: '2',
            data: () => ({ })
        },
        {
            id: '3',
            data: () => ({ })
        },
    ];

    // Mock the subscribeToCollection function
    queries.subscribeToCollection = jest.fn((_, handleSnapshot) => {
        handleSnapshot({ docs: mockSubscriptionData });
    });

    // Render the GameListItem component
    const { getByText} = render(<Router><GameListItem game={game} /></Router>);

    // Wait for the component to render
    await waitFor(() => {
        // Check if the player count is correct
        expect(getByText('Player Count: 3')).toBeInTheDocument();
    });
});