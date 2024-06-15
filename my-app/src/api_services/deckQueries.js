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
        return data;
    } catch (error) {
        console.error(`Failed to draw ${count} cards:`, error);
        throw error;
    }
}