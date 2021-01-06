import _pullAt from 'lodash/pullAt';
import Deck from './deck';
import MOVES from './moves';

const NUM_PLAYERS = 2;
const CARDS_PER_PLAYER = 5;

// 4 players -> 7, 8
const getDrawPileSpecs = (numPlayers) => {
    let drawPileConfig = [
        [],[],
        [7, 8, 9, 10],
        [7, 8, 9, 10],
        [7, 8],
        [7],
        []
    ];
    return drawPileConfig[numPlayers];
}

export const TicTacToe = {
    name: 'TicTacToe',
    minPlayers: 2,
    maxPlayers: 6,
    setup: (ctx, setupData) => {
        let deck = Deck.init();

        // Draw one card for each of the non-player letters
        // No need for separate drawPile decks as long as we maintain the number of cards in each drawPile.
        let drawPiles = [];
        let drawPileSpecs = getDrawPileSpecs(NUM_PLAYERS);
        drawPileSpecs.forEach((drawPile) => {
            let letters = [];
            for (let i = 0; i < drawPile; i++) {
                let {card, newDeck} = Deck.draw(deck);
                deck = newDeck;
                letters.push(card);
            }
            let extra = {
                activeLetterIndex: 0,
                letters,
            };
            drawPiles.push(extra);
        });

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

        return {
            clue: [],
            clues: [],
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
            // Stage for the active player
            action: {
                moves: {
                    deselectCard: MOVES.deselectCard,
                    nextLetter: MOVES.nextLetter,
                    selectCard: MOVES.selectCard,
                    sendMessage: MOVES.sendMessage,
                    submitClue: MOVES.submitClue,
                }
            },
            // These are the non-active players
            idle: {
                moves: {
                    nextLetter: MOVES.nextLetter,
                    pass: MOVES.pass,
                    sendMessage: MOVES.sendMessage,
                }
            },
            // This is the player state where they are ready for the next turn.
            ready: {
                moves: {
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
};
