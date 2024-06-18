// this component is a container for 5x card images
// make it contain https://www.deckofcardsapi.com/static/img/back.png for now

import { useEffect, useState } from 'react';
import { CardGroup, Card, Button, CardBody } from 'react-bootstrap';
import { subscribeToDocument } from '../proxies/queries';
import LoadingSpinner from './LoadingSpinner';
import PokerCard from './PokerCard';

/**
 * PokerHand component.
 * This component is a container for 5x card images.
 * @component
 * @returns {React.JSX.Element} The rendered PokerHand component.
 */
export const PokerHand = ({ player, cardsToSwap, setCardsToSwap, isLoadingCards }) => {

    const handleCardClick = (index) => {
        // Call the setCardsToSwap function passed from the parent component
        setCardsToSwap(prevState => {
            // Check if the card is already in the cardsToSwap array
            if (prevState.includes(index)) {
                // If it is, remove it from the array
                return prevState.filter(i => i !== index);
            } else {
                // If it's not, add it to the array
                return [...prevState, index];
            }
        });
    }

    return (
        <CardGroup style={{ maxWidth: '1000px' }}>


            {player?.hand?.map((card, index) => (
                <PokerCard       
                    card={card}
                    index={index}
                    handleCardClick={handleCardClick}
                    cardsToSwap={cardsToSwap}
                    isLoadingCards={isLoadingCards}
                />
            ))}

        </CardGroup>
    );
}