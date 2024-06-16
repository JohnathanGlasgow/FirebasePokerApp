/**
 * deckQueries.js
 * This file is used to define the requests to the Deck of Cards API.
 * The API is hosted at www.deckofcardsapi.com
 */

/**
 * This function gets a new, shuffled deck of cards from the API.
 * @returns {Promise<Object>} A Promise that resolves with the deck object.
 */
export const getDeck = async () => {
    try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        console.log('Deck ID:', data.deck_id);
        return data;
    } catch (error) {
        console.error('Failed to get deck:', error);
        throw error;
    }
}

/**
 * This function draws a card from the deck.
 * @param {string} deckId - The ID of the deck to draw from.
 * @returns {Promise<Object>} A Promise that resolves with the card object.
 */
export const drawCards = async (deckId, count) => {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
        const data = await response.json();
        console.log(`Drew ${count} cards from deck ${deckId}:`, data.cards.map(card => card.code));
        return data;
    } catch (error) {
        console.error(`Failed to draw ${count} cards:`, error);
        throw error;
    }
}

/**
 * This function returns number of cards remaining in the deck using https://www.deckofcardsapi.com/api/deck/zegdsdvbbudn/return/
 * @param {string} deckId - The ID of the deck to draw from.
 * @returns {Promise<Object>} A Promise that resolves with the card object.
 */

export const getRemainingCards = async (deckId) => {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=0`);
        const data = await response.json();
        console.log(`Remaining cards in deck ${deckId}:`, data.remaining);
        return data;
    } catch (error) {
        console.error(`Failed to get remaining cards:`, error);
        throw error;
    }
}