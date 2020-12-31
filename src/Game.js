import _pullAt from 'lodash/pullAt';
import Deck from './deck';
import MOVES from './moves';

const NUM_DRAW_PILES = 3;
const NUM_PLAYERS = 2;
const CARDS_PER_PLAYER = 5;

// 4 players -> 7, 8

export const TicTacToe = {
    name: 'TicTacToe',
    minPlayers: 2,
    maxPlayers: 6,
    setup: (ctx, setupData) => {
        let deck = Deck.init();

        // Draw one card for each of the non-player letters
        // No need for separate drawPile decks as long as we maintain the number of cards in each drawPile.
        let drawPiles = [];
        for (let i = 0; i < NUM_DRAW_PILES; i++) {
            let {card, newDeck} = Deck.draw(deck);
            deck = newDeck;
            drawPiles.push({currentLetter: card, cardLeft: 8});
        }

        // Deal randomized 5-card hand to each player
        // TODO -- let players pick hands for each other
        let players = {};
        for (let i = 0; i < NUM_PLAYERS; i++) {
            let letters = [];
            for (let j = 0; j < CARDS_PER_PLAYER; j++) {
                let {card, newDeck} = Deck.draw(deck);
                deck = newDeck;
                card.owner = i;
                letters.push(card);
            }
            players[i] = {
                activeLetterIndex: 0,
                letters,
            };
        }

        console.log(players);
        console.log(deck.length);

        return {
            cells: Array(9).fill(null),
            clue: [],
            players,
            deck,
            drawPiles,
            chat: [],
        };
    },
    turn: {
        moveLimit: 1,
        onBegin: (G, ctx) => {
            ctx.events.setActivePlayers({currentPlayer: 'action', others: 'idle'});
        },
        stages: {
            action: {
                moves: {
                    deselectCard: MOVES.deselectCard,
                    nextLetter: MOVES.nextLetter,
                    selectCard: MOVES.selectCard,
                    sendMessage: MOVES.sendMessage,
                }
            },
            idle: {
                moves: {
                    nextLetter: MOVES.nextLetter,
                    sendMessage: MOVES.sendMessage,
                }
            }
        }
    },
    // TODO -- return sanitized game state for the active player
    playerView: (G, ctx, playerID) => {
        return G;
    },
    endIf: (G, ctx) => {

    },
    ai: {
        enumerate: (G, ctx) => {
            let moves = [];
            for (let i = 0; i < 9; i++) {
                if (G.cells[i] === null) {
                    moves.push({ move: 'clickCell', args: [i] });
                }
            }
            return moves;
        },
    },
};
