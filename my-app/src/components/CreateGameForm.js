/**
 * CreateGameForm.js
 * This component is for adding games
 */

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { addDocument, setDocument } from '../proxies/queries';
import { useAuth } from '../contexts/AuthContext';
import { getDeck } from '../api_services/deckQueries';

export const CreateGameForm = () => {
    const { uid, userName } = useAuth();
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [gameName, setGameName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        setError('');
        e.preventDefault();
        if (gameName === '') {
            setError('Please enter a game name.');
            return;
        }
        try {
            setIsLoading(true);
            const deck = await getDeck();
            const newGameId = await addDocument(['games'], { name: gameName, deckId: deck.deck_id, phase: 0, turn: 0, gameStarted: false});
            await setDocument(['games', newGameId, 'players', uid ], { name: userName, hasSwapped: false  });
            setGameName('');
            !gameId && navigate(`/games/${newGameId}`);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className='games-form'>
            
            <Form.Group controlId="formGameName">
                <Form.Control
                    type="text"
                    placeholder="Enter game name"
                    value={gameName}
                    onFocus={() => setError('')}
                    onChange={(e) => setGameName(e.target.value)}
                    isInvalid={error !== ''}
                />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Game' : 'Create Game'}
            </Button>
        </Form>
    );
};
