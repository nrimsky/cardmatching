
const shapes = ['circle', 'square', 'triangle', 'star'];
const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];
const numbers = [1, 2, 3, 4, 5, 6];

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
    const bottomCard = {
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        number: numbers[Math.floor(Math.random() * numbers.length)],
    };
    const matchIndex = Math.floor(Math.random() * 5);

    for (let i = 0; i < 5; i++) {
        const card = {
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            number: numbers[Math.floor(Math.random() * numbers.length)],
        };

        if (i === matchIndex) {
            switch (rule) {
                case 'Match on Shape':
                    card.shape = bottomCard.shape;
                    break;
                case 'Match on Color':
                    card.color = bottomCard.color;
                    break;
                case 'Match on Number':
                    card.number = bottomCard.number;
                    break;
                default:
                    throw new Error('Invalid rule');
            }
        }

        deck.push(card);
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