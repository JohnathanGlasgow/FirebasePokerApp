/**
 * @file        CreateGameForm.js
 * @description This file defines the form component for creating a new game.
 * @author      Johnathan Glasgow
 * @date        14/06/2024
 */

import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { addDocument, setDocument } from '../proxies/queries';
import { useAuth } from '../contexts/AuthContext';
import { getDeck } from '../api_services/deckQueries';

/**
 * The CreateGameForm component.
 * This component is a form for creating a new game.
 * It is contained within the GamesCard component.
 * 
 * @returns {React.JSX.Element} The rendered CreateGameForm component.
 */
export const CreateGameForm = () => {
    const { uid, userName } = useAuth();
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [gameName, setGameName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the form submission.
     * 
     * @param {Object} e - The event object.
     * @returns {Promise<void>} A promise that resolves when the form is submitted.
     */
    const handleSubmit = async (e) => {
        setError('');
        e.preventDefault();
        if (gameName === '') {
            setError('Please enter a game name.');
            return;
        }
        try {
            setIsLoading(true);
            // Get a new deck from the API and add a new game document to the database
            const deck = await getDeck();
            const newGameId = await addDocument(['games'], { name: gameName, deckId: deck.deck_id, phase: 0, turn: 0, gameStarted: false });
            await setDocument(['games', newGameId, 'players', uid], { name: userName, hasSwapped: false });
            setGameName('');
            // If there is no gameId in the URL, navigate to the new game
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
