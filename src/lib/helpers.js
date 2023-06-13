
const shapes = ['triangle', 'star', 'cross', 'circle'];
const colors = ['red', 'green', 'orange', 'blue'];
const numbers = [1, 2, 3, 4];

function generateRule() {
    // Pick one of Match on Shape, Match on Color, Match on Number
    const rule = ['Match on Shape', 'Match on Color', 'Match on Number'][Math.floor(Math.random() * 3)];
    return rule;
}

function generateDeck(rule) {
    // Given a rule, only one of the top row cards will match the bottom card
    // Return an array of 5 top cards plus the bottom card as the last element
    // There should be exactly one match
    // Each card should have a shape, color, and number
    const deck = [];
    for (let i = 0; i < 4; i++) {
        deck.push({
            shape: shapes[i],
            color: colors[i],
            number: numbers[i],
        });
    }

    const bottomCard = {
    };
    const matchIndex = Math.floor(Math.random() * 4);
    const card = deck[matchIndex];

    switch (rule) {
        case 'Match on Shape':
            bottomCard.shape = card.shape;
            // Other properties are random but not the same as the match
            do {
                bottomCard.color = colors[Math.floor(Math.random() * 4)];
            } while (bottomCard.color === card.color);
            do {
                bottomCard.number = numbers[Math.floor(Math.random() * 4)];
            } while (bottomCard.number === card.number);

            break;
        case 'Match on Color':
            bottomCard.color = card.color;
            do {
                bottomCard.shape = shapes[Math.floor(Math.random() * 4)];
            } while (bottomCard.shape === card.shape);
            do {
                bottomCard.number = numbers[Math.floor(Math.random() * 4)];
            } while (bottomCard.number === card.number);

            break;
        case 'Match on Number':
            bottomCard.number = card.number;
            do {
                bottomCard.color = colors[Math.floor(Math.random() * 4)];
            } while (bottomCard.color === card.color);
            do {
                bottomCard.shape = shapes[Math.floor(Math.random() * 4)];
            } while (bottomCard.shape === card.shape);

            break;
        default:
            throw new Error('Invalid rule');
    }

    deck.push(bottomCard);

    return deck;

}

function isCorrectMatch(card1, card2, rule) {
    switch (rule) {
        case 'Match on Shape':
            return card1.shape === card2.shape;
        case 'Match on Color':
            return card1.color === card2.color;
        case 'Match on Number':
            return card1.number === card2.number;
        default:
            throw new Error('Invalid rule');
    }
}

export { generateRule, generateDeck, shapes, colors, numbers, isCorrectMatch };