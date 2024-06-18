/**
 * @file        GameListItem.js
 * @description This file defines a component that represents a single game listing in the GamesCard component.
 * @author      Johnathan Glasgow
 * @date        16/06/2024
 */

import { CardGroup } from 'react-bootstrap';
import PokerCard from './PokerCard';

/**
 * PokerHand component.
 * This component is a container for 5x card images.
 * @component
 * @returns {React.JSX.Element} The rendered PokerHand component.
 */
export const PokerHand = ({ player, cardsToSwap, setCardsToSwap, isLoadingCards }) => {

    /**
     * Handles the event when a card is clicked.
     * If the card's index is already in the cardsToSwap array, it removes it.
     * If it's not, it adds it to the array.
     *
     * @param {number} index - The index of the clicked card.
     */
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