import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameRoute } from '../../components/GameRoute';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../components/GamesCard', () => ({
    GamesCard: () => <div>Mock GamesCard</div>
}));

jest.mock('../../components/GameBoard', () => ({
    GameBoard: () => <div>Mock GameBoard</div>
}));

describe('GameRoute', () => {
    test('renders without crashing', () => {
        render(
            <MemoryRouter>
                <GameRoute />
            </MemoryRouter>
        );
    });

    test('renders GamesCard initially', () => {
        render(
            <MemoryRouter>
                <GameRoute />
            </MemoryRouter>
        );

        expect(screen.getByText('Mock GamesCard')).toBeInTheDocument();
    });
});