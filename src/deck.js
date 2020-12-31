import _pullAt from 'lodash/pullAt';
import { v4 as uuid } from 'uuid';

const addToDeck = (deck, letter, number) => {
    let newDeck = [...deck];
    for (let i = 0; i < number; i++) {
        let card = {
            id: uuid(),
            letter,
            owner: null,
        }
        newDeck.push(card);
    }
    return newDeck;
};

const Deck = {
    init: () => {
        let deck = [];
        deck = addToDeck(deck, 'A', 4);
        deck = addToDeck(deck, 'B', 2);
        deck = addToDeck(deck, 'C', 3);
        deck = addToDeck(deck, 'D', 3);
        deck = addToDeck(deck, 'E', 6);
        deck = addToDeck(deck, 'F', 2);
        deck = addToDeck(deck, 'G', 2);
        deck = addToDeck(deck, 'H', 3);
        deck = addToDeck(deck, 'I', 4);
        deck = addToDeck(deck, 'K', 2);
        deck = addToDeck(deck, 'L', 3);
        deck = addToDeck(deck, 'M', 2);
        deck = addToDeck(deck, 'N', 3);
        deck = addToDeck(deck, 'O', 4);
        deck = addToDeck(deck, 'P', 2);
        deck = addToDeck(deck, 'R', 4);
        deck = addToDeck(deck, 'S', 4);
        deck = addToDeck(deck, 'T', 4);
        deck = addToDeck(deck, 'U', 3);
        deck = addToDeck(deck, 'W', 2);
        deck = addToDeck(deck, 'Y', 2);
        return deck;
    },
    draw: (deck) => {
        let newDeck = [...deck];
        let randIndex = Math.ceil(newDeck.length * Math.random()) - 1;
        let card = _pullAt(newDeck, [randIndex]);
        return {card: card[0], newDeck};
    },
    WILD: {
        id: uuid(),
        letter: '*',
        owner: null,
    }
};

export default Deck;