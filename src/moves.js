import { INVALID_MOVE } from 'boardgame.io/core';

const MOVES = {
    clickCell: (G, ctx, id) => {
        if (G.cells[id] !== null) {
            return INVALID_MOVE;
        }
        G.cells[id] = ctx.currentPlayer;
    },
    deselectCard: {
        move: (G, ctx, card) => {
            let lastClue = G.clue[G.clue.length - 1];
            if (lastClue.id === card.id) {
                G.clue.pop();   
            }
        },
        noLimit: true,
    },
    nextLetter: {
        move: (G, ctx, playerID) => {
            G.players[playerID].activeLetterIndex++;
        },
        noLimit: true,
    },
    selectCard: {
        move: (G, ctx, card) => {
            G.clue.push(card);
        },
        noLimit: true,
    },
    sendMessage: {
        move: (G, ctx, playerName, message) => {
            G.chat.push({
                id: playerName,
                msg: message
            })
        },
        noLimit: true,
    }
}

export default MOVES;