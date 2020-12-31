import { INVALID_MOVE } from 'boardgame.io/core';

export const TicTacToe = {
  setup: (ctx, setupData) => {
    return {
      cells: Array(9).fill(null),
      players: {
        0: {
          activeLetterIndex: 0,
          letters: ['A', 'S', 'D', 'F']
        },
        1: {
          activeLetterIndex: 0,
          letters: ['Q', 'W', 'E', 'R', 'T', 'Y']
        }
      },
      // Build the deck here. No need for separate drawPile decks as long as we maintain the number of cards in each drawPile.
      deck: [],
      drawPiles: [
        {
          currentLetter: 'X',
          cardsLeft: 8,
        },{
          currentLetter: 'Y',
          cardsLeft: 8,
        },{
          currentLetter: 'Z',
          cardsLeft: 8,
        }
      ]
    };
  },

  turn: {
    moveLimit: 1,
  },

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = ctx.currentPlayer;
    },
    // Stubbed handler to process card clicks
    clickCard: {
      move: (G, ctx, id) => {
        console.log('clickCard()');
      },
      noLimit: true,
    },
    // Handler for moving on to the next letter
    nextLetter: {
      move: (G, ctx, playerID) => {
        G.players[playerID].activeLetterIndex++;
      },
      noLimit: true,
    }
  },

  // TODO -- return sanitized game state for the active player
  playerView: (G, ctx, playerID) => {
    return G;
  },

  endIf: (G, ctx) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
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

// Return true if `cells` is in a winning configuration.
function IsVictory(cells) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = row => {
    const symbols = row.map(i => cells[i]);
    return symbols.every(i => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some(i => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells) {
  return cells.filter(c => c === null).length === 0;
}

