import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameBoard } from '../../components/GameBoard';

jest.mock('../../contexts/AuthContext.js', () => ({
    useAuth: () => ({ uid: '1', userName: 'Test User' }),
}));

describe('GameBoard', () => {
  it('renders without crashing', () => {
    const mockPlayers = [
      { id: '1', name: 'Player 1' },
      { id: '2', name: 'Player 2' }
    ];
    const mockGame = {
      id: '1',
      name: 'Test Game',
      phase: 0,
      deckId: 'deck1',
      order: [{ name: 'Test User', id: '1' }, { name: 'Player 2', id: '2' }],
      turn: 0
    };

    const { container } = render(<GameBoard players={mockPlayers} game={mockGame} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the correct game name', () => {
    const mockPlayers = [
      { id: '1', name: 'Player 1' },
      { id: '2', name: 'Player 2' }
    ];
    const mockGame = {
      id: '1',
      name: 'Test Game',
      phase: 0,
      deckId: 'deck1',
      order: [{ name: 'Player 1', id: '1' }, { name: 'Player 2', id: '2' }],
      turn: 0
    };

    render(<GameBoard players={mockPlayers} game={mockGame} />);
    expect(screen.getByText('Test Game')).toBeInTheDocument();
  });

  it('renders the correct player count', () => {
    const mockPlayers = [
      { id: '1', name: 'Player 1' },
      { id: '2', name: 'Player 2' }
    ];
    const mockGame = {
      id: '1',
      name: 'Test Game',
      phase: 0,
      deckId: 'deck1',
      order: [{ name: 'Player 1', id: '1' }, { name: 'Player 2', id: '2' }],
      turn: 0
    };

    render(<GameBoard players={mockPlayers} game={mockGame} />);
    expect(screen.getByText('Player Count: 2')).toBeInTheDocument();
  });

    it('renders the correct user\'s turn', () => {
        const mockPlayers = [
        { id: '1', name: 'Test User' },
        { id: '2', name: 'Player 2' }
        ];
        const mockGame = {
        id: '1',
        name: 'Test Game',
        phase: 1,
        deckId: 'deck1',
        order: [{ name: 'Test User', id: '1' }, { name: 'Player 2', id: '2' }],
        turn: 1
        };
    
        render(<GameBoard players={mockPlayers} game={mockGame} />);
        expect(screen.getByText('It\'s Player 2\'s turn')).toBeInTheDocument();
    });
});