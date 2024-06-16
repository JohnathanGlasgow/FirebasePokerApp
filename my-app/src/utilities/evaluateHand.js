function getCardValue(card) {
    const value = card[0];
    switch(value) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 11;
        case 'T': return 10;
        default: return parseInt(value);
    }
}

export function getHandRanking(hand) {
    let values = hand.map(card => getCardValue(card)).sort((a, b) => a - b);
    let suits = hand.map(card => card[1]);

    let isFlush = suits.every(suit => suit === suits[0]);

    let isStraight = values.every((val, index) => {
        if (index === 0) return true;
        return val === values[index - 1] + 1;
    });

    if (isFlush && values.join('') === '1011121314') return { rank: 10, rankName: 'Royal Flush' };
    if (isFlush && isStraight) return { rank: 9, rankName: 'Straight Flush' };
    if (values[0] === values[3] || values[1] === values[4]) return { rank: 8, rankName: 'Four of a Kind' };
    if ((values[0] === values[2] && values[3] === values[4]) || (values[0] === values[1] && values[2] === values[4])) return { rank: 7, rankName: 'Full House' };
    if (isFlush) return { rank: 6, rankName: 'Flush' };
    if (isStraight) return { rank: 5, rankName: 'Straight' };
    if (values[0] === values[2] || values[1] === values[3] || values[2] === values[4]) return { rank: 4, rankName: 'Three of a Kind' };
    if ((values[0] === values[1] && values[2] === values[3]) || (values[0] === values[1] && values[3] === values[4]) || (values[1] === values[2] && values[3] === values[4])) return { rank: 3, rankName: 'Two Pair' };
    if (values[0] === values[1] || values[1] === values[2] || values[2] === values[3] || values[3] === values[4]) return { rank: 2, rankName: 'One Pair' };

    return { rank: 1, rankName: 'No rank'};
}

// // Example usage:
// let hand = ['AC', 'KC', 'QC', 'JC', 'TC']; // Royal Flush
// console.log(getHandRanking(hand)); // { rank: 10, rankName: 'Royal Flush' }
