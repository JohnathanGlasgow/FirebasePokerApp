/**
 * GamePage.js
 * 
 * This component displays the game page.
 */


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { subscribeToDocument, setDocument } from '../proxies/queries';
import { Alert, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { PokerHand } from './PokerHand';
import { drawCards, getRemainingCards } from '../api_services/deckQueries';
import { setDoc } from '@firebase/firestore';
import { getHandRanking } from '../utilities/evaluateHand';

/**
 * GamePage component.
 * Shows the todo list for a game if the user is a member of the game.
 * 
 * @component
 * @returns {React.JSX.Element} The rendered GamePage component.
 */
export default function GameBoard({ players, game }) {
    const { uid } = useAuth();
    const { gameId } = useParams();
    // const [game, setGame] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [remainingCards, setRemainingCards] = useState(52);
    const [player, setPlayer] = useState(null);
    const [cardsToSwap, setCardsToSwap] = useState([]);
    const [rank, setRank] = useState(null);
    const [rankName, setRankName] = useState(null);

    useEffect(() => {
        //find player that matches uid and use to setPlayer
        players &&
            setPlayer(players.find(player => player.id === uid));
        console.log(player);
    }, [players, uid]);

    useEffect(() => {
        getRemainingCards(game?.deckId).then((cards) => {
            setRemainingCards(cards.remaining);
        });
    }, [game, gameId]);

    async function handleIncrementPhase() {
        const newPhase = game.phase + 1;
        await setDocument(['games', gameId], { ...game, phase: newPhase });
        console.log(game.phase);
        game.phase === 0 &&
            deal();
    }

    const deal = async () => {
        console.log('Dealing cards...');
        for (const player of players) {
            try {
                const cards = await drawCards(game.deckId, 5);
                setRemainingCards(cards.remaining);
                setDocument(['games', gameId, 'players', player.id], { hand: cards.cards });
                console.log(cards);
            } catch (error) {
                console.error(`Error dealing cards to ${player}: ${error}`);
            }
        }
    }

    // function to swap cards
    const swapCards = async (cardIndexes) => {
        console.log('Swapping cards...');
        try {
            const newCards = await drawCards(game.deckId, cardsToSwap.length);
            setRemainingCards(newCards.remaining);

            // Create a copy of the player's hand
            console.log(player.hand);
            const newHand = [...player.hand];

            // Replace the cards at the specified indexes
            cardsToSwap.forEach((index, i) => {
                newHand[index] = newCards.cards[i];
            });

            setDocument(['games', gameId, 'players', player.id], { hand: newHand });
            console.log(newHand);
            console.log(newCards);
        } catch (error) {
            console.error(`Error swapping cards for ${player}: ${error}`);
        }
    }

    const evaluate = () => {
        const hand = player.hand.map(card => card.code);
        const result = getHandRanking(hand);
        setRank(result.rank);
        setRankName(result.rankName);
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!game) {
        return <Alert variant="info">Loading...</Alert>;
    }

    if (!player) {
        return <Alert variant="danger">{`You are not a member of ${game.name}`}</Alert>;
    }
    // return a card with some test text
    return (
        <Card>
            <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Text>
                    Player Count: {players?.length}
                </Card.Text>
                <Card.Text>
                    Phase: {game.phase}
                </Card.Text>
                <Card.Text>
                    DeckID: {game.deckId}
                </Card.Text>
                <Card.Text>
                    Cards Remaining: {remainingCards}
                </Card.Text>
                <Card.Text>
                    Rank: {rank}
                </Card.Text>
                <Card.Text>
                    Rank name: {rankName}
                </Card.Text>
                <div className='game-board-buttons'>
                    <Button onClick={handleIncrementPhase}>Start Game</Button>{ }
                    <Button onClick={swapCards}>Swap Cards</Button>
                    <Button onClick={evaluate}>Evaluate</Button>
                </div>
                <PokerHand player={player} setCardsToSwap={setCardsToSwap} />
            </Card.Body>
        </Card>
    );
}

